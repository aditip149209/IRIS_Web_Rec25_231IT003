A web-based system for students and faculty to book sports facilities and equipment, with role-based access control for administrators (sports authorities) to manage resources efficiently.

Installation Steps

1. Clone this repository
2. Go to the frontend folder, run 'npm i' to install frontend dependencies
3. Go to the backend folder, run 'npm i' to install backend dependencies
4. Create a .env file in the project's root directory and add the required database details: DB_NAME=your_database_name DB_USER=your_username DB_PASSWORD=your_password DB_HOST=localhost DB_DIALECT=mysql Since mysql was used in this project, use mysql ideally. Else, replace DB_DIALECT with the dialect name of your database software. Accordingly, fill in your database name, username and password.

Run the project by following these steps:

1. Open a new terminal, navigate to the backend folder, run 'npm run dev'
2. Open another terminal, navigate to the backend folder again and run node seed.js (to populate the database with data)
3. Open finally another terminal, navigate to the frontend folder, run 'npm run dev'.
4. Login as Admin1@example.com (password AdminPass1!) to test both the admin and student functionality. (or register if you'd like, however you'll be able to test only student functionality that way)

SportsHub is up and running !

Demo Video: https://drive.google.com/drive/folders/1PNKh68G6pTexm2wxXqSdRqHw_TBmCfof?usp=drive_link

List of Features:

1. Student Side View: Book equipment, facilities and delete facility bookings. Can see list of upcoming bookings for both facility and equipment
2. Admin Side View: Manage bookings, equipment and facilities.
3. Analytics for Admin
4. Waitlist System in case a student tries booking an already booked slot.
5. Nodemailer has been used, along with a fake SMTP service(ethereal) to send email notifications.
6. Admin can access the student side as well, in case they want to make bookings.
7. Authentication using JWT, authorization is done using a role based access system implemented from scratch in the role middleware for the backend, and the Protected.jsx for the frontend routes.

List of Features that may be implemented further:

1. Swimming Pool form submission and card generation
2. Showing analytics as per the chosen time interval(month, year, semester,week)
3. Penalty system
4. Adding an announcements page so admins can notify students about the latest developments in the sports infra

List of Known Bugs

1. Observed that data may be added/updated, in the admin functions, but the page doesnt refresh/convey that the operation is done, leaving the user confused.
2. Prop issue while booking equipment, because of which the equipment name during booking is undefined (as seen in the current equipment rentals section).
3. Fixed the heading in the Manage Facility section(wrong heading in the video, but fixed it now).

References

1. Node-https://nodejs.org/docs/latest/api/
2. Express-https://expressjs.com/en/5x/api.html
3. RBAC Implementation- https://www.youtube.com/watch?v=HHuiV841g_w
4. TailwindCSS- https://tailwindcss.com/
5. Vite- https://vite.dev/guide/
6. For components/styling -https://daisyui.com/
7. JWT- https://www.npmjs.com/package/jsonwebtoken
8. sequelize as an orm
