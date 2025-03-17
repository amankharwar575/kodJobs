# Gunicorn configuration file
bind = "0.0.0.0:5000"
workers = 4  # Generally (2 x NUM_CORES) + 1
worker_class = "sync"
timeout = 120