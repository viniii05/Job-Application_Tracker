const express = require('express');
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cron = require("node-cron");
const sendReminderEmails = require("./utils/emailServices");
const sequelize = require('./config/database');

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const tracker = require('./routes/jobRoutes');
const userRoutes = require('./routes/userRoutes');
const companiesRoutes = require('./routes/companyRoutes');
const savedJobRoutes = require("./routes/savedJobRoutes");

const app = express();

cron.schedule("0 9 * * *", () => {
    console.log("⏰ Running daily email reminders...");
    sendReminderEmails();
}, {
    timezone: "America/New_York"
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname, 'views')));

app.use('/', authRoutes);
app.use('/', dashboardRoutes);
app.use('/', tracker)
app.use('/api', userRoutes);
app.use('/api', companiesRoutes);
app.use('/api', savedJobRoutes);

sequelize.sync()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => console.log('Server running on port 3000'));
    console.log('Database connected successfully');
  })
  .catch(err => console.error('Database connection error:', err));
