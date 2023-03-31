Getting Started:

Dependencies:

Install Docker and Docker Compose: Make sure you have Docker and Docker Compose installed on your machine. Visit the official Docker website for installation instructions: https://docs.docker.com/engine/install/

Install Git (Optional): If you want to clone the repository using Git, ensure Git is installed on your machine. 

Step 1.
Navigate to a suitable directory in your terminal and then run:

git clone https://github.com/7-10-16/runners_crisps_comp.git

Then:

cd runners_crisps_comp

To change directory into the newly created directory
Followed by:

docker-compose up -d

This command will build the Docker images for the presentation, business logic, and database tiers, and start the containers in the background.

Access the application:

After the containers have started, open your web browser and navigate to http://localhost:8000 to access the presentation tier of the application. Enter the required details and submit the form to test the application.

To finish testing:
run:

docker-compose down

To Deploy to the AWS:

Open the Elastic Beanstalk console on the AWS Management Console.

Then:

Click "Create a new environment" to start the creation process.

Then:

Select "Web server environment".
In the "Application code" section, select "Upload your code" and upload this zip.

Then:

Click "Create Environment". 

You're done.

