A web application that allows users registered with NITK to access the sports facilities offered by the campus in a seamless, hasslefree way.

Installation Steps

Clone this repository
Go to the frontend folder, run 'npm i' to install frontend dependencies
Go to the backend folder, run 'npm i' to install backend dependencies
Create a .env file in the project's root directory and add the required database details: DB_NAME=your_database_name DB_USER=your_username DB_PASSWORD=your_password DB_HOST=localhost DB_DIALECT=mysql Since mysql was used in this project, use mysql ideally. Else, replace DB_DIALECT with the dialect name of your database software. Accordingly, fill in your database name, username and password.
Run the project by following these steps:

Open a new terminal, navigate to the backend folder, run 'npm run dev'
Open another terminal, navigate to the backend folder again and run node seed.js (to populate the database with data)
Open finally another terminal, navigate to the frontend folder, run 'npm run dev'.
Login as Admin1@example.com (password AdminPass1!) to test both the admin and student functionality. (or register if you'd like, however you'll be able to test only student functionality that way)
SportsHub is up and running !

Demo Video:
