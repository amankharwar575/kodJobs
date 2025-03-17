import os
import requests
import json
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
from flask import Flask, jsonify, request, abort
from flask_cors import CORS
import jwt
import bcrypt
import uuid

# Create Flask app
app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173", "http://localhost:5176"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})
app.config['SECRET_KEY'] = 'your-secret-key-here'  # Change this in production!

# Update file paths
USERS_FILE = os.path.join(os.path.dirname(__file__), 'users.json')
APPLICATIONS_FILE = os.path.join(os.path.dirname(__file__), 'applications.json')
SAVED_JOBS_FILE = os.path.join(os.path.dirname(__file__), 'saved_jobs.json')
TOKEN_EXPIRATION = 3600  # 1 hour

# Directly set your Jooble API key here
JOOBLE_API_KEY = '0f9b22f5-16a2-461b-ae1e-5fac5dfb0d21'  # Replace with your actual Jooble API key
JOOBLE_API_URL = "https://api.jooble.io/{key}/"

# Helper functions
def load_data(filename):
    try:
        if not os.path.exists(filename):
            # Create file with empty array if it doesn't exist
            with open(filename, 'w', encoding='utf-8') as f:
                f.write('[]')
            return []
        
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
            # Check if file is empty
            if not content:
                return []
            return json.loads(content)
    except Exception as e:
        print(f"Error loading {filename}: {str(e)}")
        # Create new file if there's an error
        with open(filename, 'w', encoding='utf-8') as f:
            f.write('[]')
        return []

def save_data(data, filename):
    """Save job data to a JSON file."""
    try:
        # Create directory if it doesn't exist
        directory = os.path.dirname(filename)
        if directory and not os.path.exists(directory):
            os.makedirs(directory)
            
        with open(filename, 'w') as f:
            json.dump(data, f, indent=4)
        return True
    except Exception as e:
        print(f"Error saving data to {filename}: {str(e)}")
        return False

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(stored_hash, password):
    return bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8'))

def create_token(user_id):
    return jwt.encode({
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(seconds=TOKEN_EXPIRATION)
    }, app.config['SECRET_KEY'], algorithm='HS256')

# Middleware
def token_required(f):
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split()[1]
        if not token:
            abort(401, 'Token is missing!')
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            request.user_id = data['user_id']
        except Exception as e:
            print(f"Token error: {str(e)}")
            abort(401, 'Invalid token!')
        return f(*args, **kwargs)
    decorated.__name__ = f.__name__
    return decorated

def scrape_indian_jobs():
    """Scrape job listings from TimesJobs."""
    try:
        url = "https://www.timesjobs.com/candidate/job-search.html?searchType=personalizedSearch&from=submit&txtKeywords=software+engineer&txtLocation=India"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        }
        
        try:
            response = requests.get(url, headers=headers, timeout=15)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, "html.parser")
            jobs = soup.find_all("li", class_="clearfix job-bx wht-shd-bx")
            
            if not jobs:
                print("No jobs found or website structure changed. Using fallback data.")
                return get_timesjobs_fallback_data()
            
            job_list = []
            for job in jobs:
                try:
                    # Extract basic info with null checks
                    title_elem = job.find("h2")
                    title = title_elem.get_text(strip=True) if title_elem else "Unknown Title"
                    
                    company_elem = job.find("h3", class_="joblist-comp-name")
                    company = company_elem.get_text(strip=True) if company_elem else "Unknown Company"
                    
                    location_elem = job.find("span", class_="srp-skills")
                    location = location_elem.get_text(strip=True).replace("location_on", "") if location_elem else "Unknown Location"
                    
                    job_link_elem = job.find("a", class_="clearfix job-post-lnk")
                    job_link = job_link_elem["href"] if job_link_elem and "href" in job_link_elem.attrs else "#"
                    
                    # Extract salary
                    salary_tag = job.find("li", class_="srp-salary")
                    salary = salary_tag.get_text(strip=True) if salary_tag else "Not disclosed"
                    
                    # Extract skills
                    skills = []
                    skill_elems = job.find_all("li", class_="srp-ellipsis")
                    if skill_elems:
                        skills = [skill.get_text(strip=True) for skill in skill_elems if hasattr(skill, 'get_text')]
                    
                    # Extract project info
                    project_info = job.find("div", class_="project-age-info")
                    posted_date = "Recent"
                    if project_info:
                        span_elem = project_info.find("span")
                        if span_elem:
                            posted_date = span_elem.get_text(strip=True)
                    
                    # Extract status
                    status_tag = job.find("span", class_="label-status")
                    status = status_tag.get_text(strip=True) if status_tag else "Not Applied"
                    
                    # Build job object
                    job_list.append({
                        "id": abs(hash(job_link)),
                        "title": title,
                        "company": company,
                        "salary": salary,
                        "location": location,
                        "skills": skills,
                        "posted": posted_date,
                        "status": status,
                        "link": job_link,
                        "expires": (datetime.now() - timedelta(days=1)).strftime("Expired %d days ago")  # Example calculation
                    })
                except Exception as e:
                    print(f"Error processing job: {str(e)}")
                    continue
            
            if not job_list:
                print("Failed to extract any jobs. Using fallback data.")
                return get_timesjobs_fallback_data()
                
            return job_list
            
        except requests.exceptions.RequestException as e:
            print(f"Request error: {str(e)}")
            return get_timesjobs_fallback_data()
    
    except Exception as e:
        print(f"Scraping error: {str(e)}")
        return get_timesjobs_fallback_data()

def get_timesjobs_fallback_data():
    """Provide fallback job data when TimesJobs scraping fails."""
    print("Using fallback TimesJobs data...")
    
    # Create some realistic job listings
    fallback_jobs = [
        {
            "id": 111222333,
            "title": "Full Stack Developer",
            "company": "Infosys",
            "salary": "₹5,00,000 - ₹8,00,000 PA",
            "location": "Bangalore, India",
            "skills": ["JavaScript", "React", "Node.js", "MongoDB"],
            "posted": "Posted 2 days ago",
            "status": "Not Applied",
            "link": "https://example.com/job/111222",
            "expires": "Expires in 28 days"
        },
        {
            "id": 444555666,
            "title": "Python Developer",
            "company": "TCS",
            "salary": "₹4,50,000 - ₹7,00,000 PA",
            "location": "Mumbai, India",
            "skills": ["Python", "Django", "Flask", "SQL"],
            "posted": "Posted 1 week ago",
            "status": "Not Applied",
            "link": "https://example.com/job/444555",
            "expires": "Expires in 21 days"
        },
        {
            "id": 777888999,
            "title": "DevOps Engineer",
            "company": "Wipro",
            "salary": "₹7,00,000 - ₹10,00,000 PA",
            "location": "Hyderabad, India",
            "skills": ["Docker", "Kubernetes", "AWS", "CI/CD"],
            "posted": "Posted 3 days ago",
            "status": "Not Applied",
            "link": "https://example.com/job/777888",
            "expires": "Expires in 27 days"
        },
        {
            "id": 123987456,
            "title": "UI/UX Designer",
            "company": "HCL Technologies",
            "salary": "₹6,00,000 - ₹9,00,000 PA",
            "location": "Delhi, India",
            "skills": ["Figma", "Adobe XD", "UI Design", "User Research"],
            "posted": "Posted 5 days ago",
            "status": "Not Applied",
            "link": "https://example.com/job/123987",
            "expires": "Expires in 25 days"
        },
        {
            "id": 456789012,
            "title": "Data Scientist",
            "company": "Tech Mahindra",
            "salary": "₹8,00,000 - ₹12,00,000 PA",
            "location": "Pune, India",
            "skills": ["Python", "Machine Learning", "TensorFlow", "Data Analysis"],
            "posted": "Posted 1 day ago",
            "status": "Not Applied",
            "link": "https://example.com/job/456789",
            "expires": "Expires in 29 days"
        }
    ]
    
    return fallback_jobs

def get_jooble_jobs(search_term="", location=""):
    """Fetch job listings from Jooble API."""
    try:
        headers = {
            "Content-Type": "application/json"
        }
        
        payload = {
            "keywords": search_term,
            "location": location,
            "radius": 25,
            "page": 1,
            "salary": 40000,
            "days": 7
        }

        try:
            # Add timeout and error handling for DNS resolution issues
            response = requests.post(
                JOOBLE_API_URL.format(key=JOOBLE_API_KEY),
                json=payload,
                headers=headers,
                timeout=10  # Add a timeout of 10 seconds
            )
            response.raise_for_status()
            return response.json().get('jobs', [])
        except requests.exceptions.ConnectionError as e:
            print(f"Jooble API connection error: {str(e)}")
            print("Check your internet connection or try again later.")
            return get_jooble_fallback_data(search_term, location)
        except requests.exceptions.Timeout as e:
            print(f"Jooble API timeout error: {str(e)}")
            print("The request to Jooble API timed out. Try again later.")
            return get_jooble_fallback_data(search_term, location)
        except requests.exceptions.RequestException as e:
            print(f"Jooble API request error: {str(e)}")
            return get_jooble_fallback_data(search_term, location)
        except Exception as e:
            print(f"Jooble API error: {str(e)}")
            return get_jooble_fallback_data(search_term, location)
    except Exception as e:
        print(f"Unexpected error in get_jooble_jobs: {str(e)}")
        return get_jooble_fallback_data(search_term, location)

def get_jooble_fallback_data(search_term="", location=""):
    """Provide fallback job data when Jooble API is unavailable."""
    print("Using fallback Jooble data...")
    
    # Create some realistic job listings that match the search criteria
    fallback_jobs = [
        {
            "id": 123456789,
            "title": f"{search_term} Specialist" if search_term else "Software Engineer",
            "company": "TechCorp Solutions",
            "salary": "₹6,00,000 - ₹9,00,000 PA",
            "location": location if location else "Bangalore, India",
            "skills": ["Python", "JavaScript", "React", "Node.js"],
            "posted": "Posted 3 days ago",
            "status": "Not Applied",
            "link": "https://example.com/job/123456",
            "expires": "Expires in 27 days"
        },
        {
            "id": 987654321,
            "title": f"Senior {search_term}" if search_term else "Senior Developer",
            "company": "Global IT Services",
            "salary": "₹8,00,000 - ₹12,00,000 PA",
            "location": location if location else "Hyderabad, India",
            "skills": ["Java", "Spring Boot", "Microservices", "AWS"],
            "posted": "Posted 1 week ago",
            "status": "Not Applied",
            "link": "https://example.com/job/987654",
            "expires": "Expires in 21 days"
        },
        {
            "id": 456789123,
            "title": f"{search_term} Lead" if search_term else "Technical Lead",
            "company": "Innovative Systems Ltd",
            "salary": "₹12,00,000 - ₹18,00,000 PA",
            "location": location if location else "Pune, India",
            "skills": ["Architecture", "Team Leadership", "Cloud", "DevOps"],
            "posted": "Posted 2 days ago",
            "status": "Not Applied",
            "link": "https://example.com/job/456789",
            "expires": "Expires in 28 days"
        },
        {
            "id": 789123456,
            "title": f"Junior {search_term}" if search_term else "Junior Developer",
            "company": "StartUp Innovations",
            "salary": "₹3,50,000 - ₹5,00,000 PA",
            "location": location if location else "Chennai, India",
            "skills": ["HTML", "CSS", "JavaScript", "React"],
            "posted": "Posted 5 days ago",
            "status": "Not Applied",
            "link": "https://example.com/job/789123",
            "expires": "Expires in 25 days"
        }
    ]
    
    return fallback_jobs

def main():
    try:
        # Scrape jobs from TimesJobs
        print("Fetching jobs from TimesJobs...")
        timesjobs = scrape_indian_jobs()
        print(f"Found {len(timesjobs)} jobs from TimesJobs")
        
        # Get jobs from Jooble
        print("Fetching jobs from Jooble API...")
        jooble_jobs = get_jooble_jobs(search_term="software engineer", location="India")
        print(f"Found {len(jooble_jobs)} jobs from Jooble")
        
        # Combine results
        all_jobs = timesjobs + jooble_jobs
        
        # If no jobs were found, provide some sample data
        if not all_jobs:
            print("No jobs found from either source. Adding sample job data.")
            all_jobs = [
                {
                    "id": 12345,
                    "title": "Software Engineer",
                    "company": "Sample Tech Company",
                    "salary": "₹5,00,000 - ₹8,00,000 PA",
                    "location": "Bangalore, India",
                    "skills": ["Python", "JavaScript", "React"],
                    "posted": "Posted 2 days ago",
                    "status": "Not Applied",
                    "link": "https://example.com/job/12345",
                    "expires": "Expires in 28 days"
                },
                {
                    "id": 67890,
                    "title": "Frontend Developer",
                    "company": "Web Solutions Inc",
                    "salary": "₹4,50,000 - ₹7,00,000 PA",
                    "location": "Mumbai, India",
                    "skills": ["HTML", "CSS", "JavaScript", "React"],
                    "posted": "Posted 1 week ago",
                    "status": "Not Applied",
                    "link": "https://example.com/job/67890",
                    "expires": "Expires in 21 days"
                },
                {
                    "id": 54321,
                    "title": "Backend Developer",
                    "company": "Data Systems Ltd",
                    "salary": "₹6,00,000 - ₹9,00,000 PA",
                    "location": "Delhi, India",
                    "skills": ["Python", "Django", "SQL", "AWS"],
                    "posted": "Posted 3 days ago",
                    "status": "Not Applied",
                    "link": "https://example.com/job/54321",
                    "expires": "Expires in 27 days"
                }
            ]
        
        # Save combined results to jobs.json
        jobs_file = os.path.join(os.path.dirname(__file__), 'jobs.json')
        if save_data(all_jobs, jobs_file):
            print(f"Successfully saved {len(all_jobs)} jobs to {jobs_file}")
        else:
            print(f"Failed to save jobs to {jobs_file}")
        
        print(f"Total jobs collected: {len(all_jobs)}")
    except Exception as e:
        print(f"Error in main function: {str(e)}")
        # Ensure we have a valid jobs.json even if everything fails
        emergency_jobs = [
            {
                "id": 999999,
                "title": "Emergency Fallback Job",
                "company": "System Recovery",
                "salary": "Not disclosed",
                "location": "Remote",
                "skills": ["Error Recovery"],
                "posted": "Just now",
                "status": "Not Applied",
                "link": "#",
                "expires": "Never"
            }
        ]
        jobs_file = os.path.join(os.path.dirname(__file__), 'jobs.json')
        save_data(emergency_jobs, jobs_file)
        print("Created emergency fallback jobs.json file")

# Routes
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        print("Received login data:", data)  # Debug log
        
        # Basic validation
        if not data or 'username' not in data or 'password' not in data:
            return jsonify({
                'message': 'Username and password are required'
            }), 400

        # Load users
        users = load_data(USERS_FILE)
        if not users:
            # Create a test user if no users exist
            test_user = {
                'id': '1',
                'username': 'test',
                'password': hash_password('test123'),
                'email': 'test@example.com'
            }
            users = [test_user]
            save_data(users, USERS_FILE)
            print("Created test user: test/test123")

        # Find user (case-insensitive username comparison)
        user = next(
            (u for u in users if u['username'].lower() == data['username'].lower()),
            None
        )

        if not user:
            return jsonify({'message': 'Invalid credentials'}), 401

        # Verify password
        if not verify_password(user['password'], data['password']):
            return jsonify({'message': 'Invalid credentials'}), 401

        # Generate token
        token = create_token(user['id'])

        return jsonify({
            'token': token,
            'userId': user['id'],
            'username': user['username']
        }), 200

    except Exception as e:
        print(f"Login error: {str(e)}")  # Debug log
        return jsonify({'message': 'Login failed', 'error': str(e)}), 500

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        print("Received registration data:", data)  # Debug log

        if not data:
            return jsonify({"message": "No data provided"}), 400

        required_fields = ['username', 'email', 'password']
        for field in required_fields:
            if field not in data:
                return jsonify({"message": f"Missing field: {field}"}), 400

        users = load_data(USERS_FILE)
        
        # Check if email already exists
        if any(user['email'] == data['email'] for user in users):
            return jsonify({"message": "Email already registered"}), 409

        # Hash password
        hashed_password = hash_password(data['password'])

        new_user = {
            "id": str(len(users) + 1),
            "username": data['username'],
            "email": data['email'],
            "password": hashed_password,
            "dob": data.get('dob', ''),
        }

        users.append(new_user)
        save_data(users, USERS_FILE)

        return jsonify({
            "message": "Registration successful",
            "userId": new_user["id"]
        }), 201

    except Exception as e:
        print(f"Registration error: {str(e)}")
        return jsonify({"message": "Registration failed"}), 500

@app.route('/jobs', methods=['GET'])
@token_required
def get_jobs():
    try:
        search = request.args.get('search', '')
        location = request.args.get('location', '')
        
        # Load jobs from jobs.json
        jobs_file = os.path.join(os.path.dirname(__file__), 'jobs.json')
        jobs = load_data(jobs_file)
        
        if not jobs:
            # If jobs.json is empty or doesn't exist, run the main function to generate jobs
            print("No jobs found in jobs.json. Generating new jobs data...")
            main()
            jobs = load_data(jobs_file)
        
        # Filter jobs
        if search:
            search = search.lower()
            jobs = [j for j in jobs if search in j['title'].lower() or 
                   search in j['company'].lower() or
                   any(search in skill.lower() for skill in j['skills'])]
        
        if location:
            location = location.lower()
            jobs = [j for j in jobs if location in j['location'].lower()]
        
        # Ensure all jobs have the required fields
        for job in jobs:
            # Ensure job has an id field (convert to int if it's a string)
            if 'id' not in job:
                job['id'] = abs(hash(job.get('link', '') or job.get('title', '')))
            elif isinstance(job['id'], str) and job['id'].isdigit():
                job['id'] = int(job['id'])
                
            # Ensure job has skills as a list
            if 'skills' not in job or not job['skills']:
                job['skills'] = ["Not specified"]
            elif isinstance(job['skills'], str):
                job['skills'] = [job['skills']]
                
            # Ensure other required fields
            if 'title' not in job or not job['title']:
                job['title'] = "Unknown Position"
                
            if 'company' not in job or not job['company']:
                job['company'] = "Unknown Company"
                
            if 'location' not in job or not job['location']:
                job['location'] = "Remote"
                
            if 'posted' not in job or not job['posted']:
                job['posted'] = "Posted recently"
                
            if 'link' not in job or not job['link']:
                job['link'] = "#"
        
        return jsonify(jobs)
    
    except Exception as e:
        print(f"Error in get_jobs: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/apply', methods=['POST'])
@token_required
def apply_job():
    data = request.get_json()
    if not data or 'jobId' not in data:
        abort(400, {'message': 'Missing job ID'})
    
    applications = load_data(APPLICATIONS_FILE)
    
    new_application = {
        'user_id': request.user_id,
        'job_id': data['jobId'],
        'applied_at': datetime.now().isoformat()
    }
    
    applications.append(new_application)
    save_data(applications, APPLICATIONS_FILE)
    return jsonify({'message': 'Application submitted successfully'}), 201

@app.route('/applications', methods=['GET'])
@token_required
def get_applications():
    applications = load_data(APPLICATIONS_FILE)
    user_apps = [app['job_id'] for app in applications if app['user_id'] == request.user_id]
    return jsonify(user_apps)

@app.route('/verify', methods=['GET'])
@token_required
def verify_token():
    users = load_data(USERS_FILE)
    user = next((u for u in users if u['id'] == request.user_id), None)
    
    if not user:
        abort(401, 'Invalid user')

    # Remove sensitive data before returning
    user_data = {
        'id': user['id'],
        'username': user['username'],
        'email': user['email'],
        'dob': user.get('dob', '')
    }
    
    return jsonify({'user': user_data})

@app.route('/saved-jobs', methods=['GET', 'POST', 'DELETE'])
@token_required
def handle_saved_jobs():
    try:
        saved_jobs = load_data(SAVED_JOBS_FILE)
        user_id = request.user_id

        if request.method == 'GET':
            user_saved = [sj for sj in saved_jobs if sj['user_id'] == user_id]
            return jsonify(user_saved)

        data = request.get_json()
        job_id = data.get('job_id')

        if not job_id:
            return jsonify({"error": "Missing job_id"}), 400

        if request.method == 'POST':
            # Check if already saved
            if not any(sj for sj in saved_jobs if sj['user_id'] == user_id and sj['job_id'] == job_id):
                new_saved = {
                    'id': str(uuid.uuid4()),
                    'user_id': user_id,
                    'job_id': job_id,
                    'saved_at': datetime.now().isoformat()
                }
                saved_jobs.append(new_saved)
                save_data(saved_jobs, SAVED_JOBS_FILE)
            return jsonify({"message": "Job saved"}), 201

        if request.method == 'DELETE':
            original_count = len(saved_jobs)
            saved_jobs = [sj for sj in saved_jobs 
                        if not (sj['user_id'] == user_id and sj['job_id'] == job_id)]
            if len(saved_jobs) < original_count:
                save_data(saved_jobs, SAVED_JOBS_FILE)
                return jsonify({"message": "Job unsaved"}), 200
            return jsonify({"message": "Job not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/jobs/<int:job_id>', methods=['GET'])
def get_job_details(job_id):
    jobs = load_data('jobs.json')
    job = next((j for j in jobs if j['id'] == job_id), None)
    if not job:
        return jsonify({"error": "Job not found"}), 404
    return jsonify(job)

# Add error handler
@app.errorhandler(404)
def not_found(e):
    return jsonify({"message": "Route not found"}), 404

def init_data_files():
    for filename in [USERS_FILE, APPLICATIONS_FILE, SAVED_JOBS_FILE]:
        try:
            if not os.path.exists(filename):
                with open(filename, 'w') as f:
                    json.dump([], f)
            else:
                # Check if file is empty or invalid
                with open(filename, 'r') as f:
                    content = f.read().strip()
                    if not content:
                        with open(filename, 'w') as f:
                            json.dump([], f)
        except Exception as e:
            print(f"Error initializing {filename}: {str(e)}")

if __name__ == "__main__":
    # Initialize data files
    init_data_files()
    
    # Generate jobs data first
    main()
    
    # Then start the Flask server
    print("Starting Flask server on http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)