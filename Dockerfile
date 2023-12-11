FROM python:3.10

# Copy the app files to the container image
RUN mkdir /app
COPY ./ /app

# Set the working directory to the app directory
WORKDIR /app

# Install the required Python packages
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 8080
EXPOSE 8080

# CMD to run the Flask app
CMD ["python", "app.py"]