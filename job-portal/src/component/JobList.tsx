import { useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

interface Job {
  id: string
  title: string
  company: string
  salary?: string
  location: string
  skills: string[]
  posted: string
}

export default function JobList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [search, setSearch] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set())
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          navigate('/')
          return
        }

        const [jobsRes, applicationsRes] = await Promise.all([
          axios.get(`http://localhost:5000/jobs?search=${search}&location=${locationFilter}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/applications', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ])

        setJobs(jobsRes.data)
        setAppliedJobs(new Set(applicationsRes.data.map((app: any) => app.job_id)))
        setLoading(false)
      } catch (err) {
        setError('Failed to load jobs')
        setLoading(false)
      }
    }

    fetchData()
  }, [search, locationFilter, navigate])

  const handleApply = async (jobId: string) => {
    try {
      const token = localStorage.getItem('token')
      await axios.post('http://localhost:5000/apply', { jobId }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAppliedJobs(prev => new Set([...prev, jobId]))
    } catch (err) {
      setError('Failed to apply. Please try again.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  if (loading) return <div className="text-center py-8">Loading...</div>
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Available Jobs</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search jobs..."
          className="p-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by location..."
          className="p-2 border rounded"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {jobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 border rounded shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <p className="text-gray-600">{job.company}</p>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {job.skills.map((skill, i) => (
                    <span 
                      key={i}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => handleApply(job.id)}
                disabled={appliedJobs.has(job.id)}
                className={`px-4 py-2 rounded transition-colors ${
                  appliedJobs.has(job.id) 
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {appliedJobs.has(job.id) ? 'Applied' : 'Apply Now'}
              </button>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {job.location} • {job.posted}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}