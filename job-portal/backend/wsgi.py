from app import app
from waitress import serve

if __name__ == "__main__":
    # For development
    app.run(debug=True)
else:
    # For production
    serve(app, host='0.0.0.0', port=5000) 