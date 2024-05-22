const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { Resend } = require('resend');
const session = require('express-session');
const mongoose = require("mongoose");


app.use(session({
  secret: 'your-secret-key', // Replace with your own secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if you're using HTTPS
 }));

 app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

 app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const UserModel = require("./models/userModels");
const BookingModel = require("./models/bookingModels");
const ContactUsModel = require("./models/contactusModel");
const Variable = require("./models/variableModels");
const ArchiveModel = require("./models/arechivemodels");



// Initialize Resend instance
const resend = new Resend('re_eNZEfFVM_CGUgGPF4R7PwHbeB2PGCST9q');
require('dotenv').config();
const port = process.env.PORT;

require("./config/parking.config");


//harhi
app.post("/api/register", async (req, res) => {
    const { fullname, email, password, phoneNumber, cin, role } = req.body;
    const newUser = { fullname, email, password, phoneNumber, cin, role };

    console.log(newUser);
    try {
        // Create a new user
        const user = await UserModel.create(newUser);

        // Send email
        const { data, error } = await resend.emails.send({
            from: 'OACA <onboarding@resend.dev>',
            to: [email], // Send email to the registered user
            subject: 'Welcome to Our Platform!',
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to Our Platform!</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        padding: 20px;
                        background-color: #fff;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        color: #007bff;
                        text-align: center;
                    }f
                    p {
                        margin: 10px 0;
                        line-height: 1.6;
                    }
                    .welcome-message {
                        font-size: 18px;
                        margin-bottom: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Welcome to Our Platform!</h1>
                    <p class="welcome-message">Hello <strong>${fullname}</strong>,</p>
                    <p class="welcome-message">Thank you for joining our platform. Your registration was successful.</p>
                    <p class="welcome-message">We're excited to have you on board!</p>
                </div>
            </body>
            </html>
            `,
                    });

        if (error) {
            console.error({ error });
            // Handle email sending error
        } else {
            console.log({ data });
            // Email sent successfully
        }

        res.json({
            user,
            message: "Registration successful"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "User already exists" });
    }
});


app.delete("/api/users/:id", async (req, res) => {
    const userId = req.params.id;

    try {
        await UserModel.findByIdAndDelete(userId);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting user" });
    }
});


//prifile
app.get("/api/user/:email", async (req, res) => {
    try {
        // Extract the email from the request parameters
        const { email } = req.params;

        // Fetch the user by email
        const user = await UserModel.findOne({ email: email });

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return the user details
        res.json({
            user,
            message: "User details fetched successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching user details" });
    }
});

//hethi update 
app.put('/api/updateUser/:id', async (req, res) => {
  try {
      const { id } = req.params; // Extracting id directly
      const { fullName, phoneNumber, cin, password, email } = req.body; // Extracting fields from the request body

      // Find the user by id
      const user = await UserModel.findById(id);

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Save the current user details before updating
      const oldFullName = user.fullname;
      const oldPhoneNumber = user.phoneNumber;
      const oldCin = user.cin;
      const oldPassword = user.password;
      const oldEmail = user.email;

      // Update the user's information
      user.fullname = fullName;
      user.phoneNumber = phoneNumber;
      user.cin = cin;
      user.password = password;
      user.email = email;
      await user.save();

      // Send email notification using resend library
      const { data, error } = await resend.emails.send({
          from: 'OACA <onboarding@resend.dev>',
          to: [oldEmail],
          subject: 'User Information Updated',
          html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>User Information Updated</title>
            <style>
              body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                background-color: #f9f9f9;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                background-color: #fff;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              h1 {
                color: #007bff;
                text-align: center;
              }
              p {
                margin: 10px 0;
              }
              .details {
                border-top: 2px solid #007bff;
                padding-top: 20px;
              }
              .detail-item {
                margin-bottom: 10px;
              }
              .detail-label {
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>User Information Updated</h1>
              <p>Hello, ${fullName}</p>
              <p>Your user information has been updated:</p>
              <div class="details">
                <div class="detail-item">
                  <span class="detail-label">Old Full Name:</span> ${oldFullName}
                </div>
                <div class="detail-item">
                  <span class="detail-label">New Full Name:</span> ${fullName}
                </div>
                <div class="detail-item">
                <span class="detail-label">Old email:</span> ${oldEmail}
              </div>
              <div class="detail-item">
                <span class="detail-label">New email:</span> ${email}
              </div>
                <div class="detail-item">
                  <span class="detail-label">Old Phone Number:</span> ${oldPhoneNumber}
                </div>
                <div class="detail-item">
                  <span class="detail-label">New Phone Number:</span> ${phoneNumber}
                </div>
                <div class="detail-item">
                  <span class="detail-label">Old Cin:</span> ${oldCin}
                </div>
                <div class="detail-item">
                  <span class="detail-label">New Cin:</span> ${cin}
                </div>
                <div class="detail-item">
                  <span class="detail-label">Old Password:</span> ${oldPassword}
                </div>
                <div class="detail-item">
                  <span class="detail-label">New Password:</span> ${password}
                </div>
              </div>
            </div>
          </body>
          </html>
          `
      });

      if (error) {
          console.error({ error });
          // Handle email sending error
      } else {
          console.log({ data });
          // Email sent successfully
      }

      res.json({
          message: "User updated successfully"
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating user details" });
  }
});


app.get('/api/allusers', async (req, res) => {
    try {
       // Fetch all users
       const users = await UserModel.find({});
   
       // Return the users
       res.json({
         users,
         message: 'Users fetched successfully',
       });
    } catch (error) {
       console.error(error);
       res.status(500).json({ message: 'Error fetching users' });
    }
   });


   //hethi login
   app.post("/api/login", async (req, res) => {
    try {
        const user = await UserModel.findOne({
            email: req.body.email,
            password: req.body.password
        });
        if (user) {
            const token = jwt.sign({
                email: user.email,
                id: user._id,
                role: user.role ,
            }, 'secret123');

            res.json({
                user: token,
                message: "user exists"
            });
        } else {
            res.status(404).json({ message: "wrong credentials" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "error" });
    }
});

//booking bch ytsajel 

const qrcode = require('qrcode');

//booking bch ytsajel 
app.post("/api/booking", async (req, res) => {
  try {
      const { email, carModel, licensePlate, bookingStartDate, bookingEndDate, price, title } = req.body;
      const bookingInfo = `Airport parking: ${carModel}\nLicense Plate: ${licensePlate}\nFrom: ${bookingStartDate}\nTo: ${bookingEndDate}\nTotal cost: ${price} dt\nZone: ${title}\nEmail: ${email}`;

      // Generate QR code
      let qrCodeDataURL;
      try {
          qrCodeDataURL = await qrcode.toDataURL(bookingInfo);
      } catch (err) {
          console.error('Error generating QR code:', err);
          return res.status(500).json({ message: "Error generating QR code" });
      }

      // Prepare the booking object without the QR code
      const booking = {
          email,
          carModel,
          licensePlate,
          bookingStartDate,
          bookingEndDate,
          price,
          title,
      };

      // Save booking data to the database
      const newBooking = new BookingModel(booking);
      await newBooking.save();

      // Prepare the email content with the QR code
      const emailContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #007bff;
            text-align: center;
          }
          p {
            margin: 10px 0;
          }
          .details {
            border-top: 2px solid #007bff;
            padding-top: 20px;
          }
          .detail-item {
            margin-bottom: 10px;
          }
          .detail-label {
            font-weight: bold;
          }
          img {
            display: block;
            margin: 20px auto;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Booking Confirmation</h1>
          <p>Hello <strong> ${email} </strong> </p>
          <p>Your booking for <strong>${carModel}</strong> (${licensePlate}) has been confirmed.</p>
          <div class="details">
            <div class="detail-item">
              <span class="detail-label">Start Date:</span> ${bookingStartDate}
            </div>
            <div class="detail-item">
              <span class="detail-label">End Date:</span> ${bookingEndDate}
            </div>
            <div class="detail-item">
              <span class="detail-label">Price:</span> ${price}
            </div>
          </div>
          <p>Scan the QR code below to view your booking details:</p>
          <img src="${qrCodeDataURL}" alt="QR Code" />
        </div>
      </body>
      </html>
      
      `;

      // Attempt to send email
      try {
          const { data, error } = await resend.emails.send({
              from: 'OACA <onboarding@resend.dev>',
              to: [email], // Send email to the provided email address
              subject: 'Booking Confirmation',
              html: emailContent,
          });

          if (error) {
              console.error({ error });
              // Handle email sending error
          } else {
              console.log({ data });
              // Email sent successfully
          }
      } catch (emailError) {
          console.error('Error sending email:', emailError);
          // If email fails to send, still return success response since booking is saved
      }

      res.status(201).json({ message: "Booking confirmed successfully" });

  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error" });
  }
});




app.post("/api/archive", async (req, res) => {
  try {
    const { email, carModel, licensePlate, bookingStartDate, bookingEndDate, price, title } = req.body;

    // Prepare the booking object
    const booking = {
      email,
      carModel,
      licensePlate,
      bookingStartDate,
      bookingEndDate,
      price,
      title,
    };

    // Save booking data to the database using ArchiveModel
    const newBooking = new ArchiveModel(booking);
    await newBooking.save();

    res.status(201).json({ message: "Booking confirmed successfully" });
  } catch (error) {
    console.error('Error processing booking:', error);
    res.status(500).json({ message: "Error processing booking" });
  }
});


app.get("/api/bookings", async (req, res) => {
    console.log("Bookings retrived"); // Debugging line
    try {
        // Extract the email from the query parameters
        const { email } = req.query;

        // Fetch bookings for the specified email
        const bookings = await BookingModel.find({ email: email });

        res.json({
            bookings: bookings,
            message: "Bookings fetched successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching bookings" });
    }
});
//all booking now 
    
app.get("/api/allbookings", async (req, res) => {
    console.log("Bookings retrieved"); // Debugging line
    try {
        // Fetch all bookings without filtering by email
        const bookings = await BookingModel.find({});

        res.json({
            bookings: bookings,
            message: "Bookings fetched successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching bookings" });
    }
});
//archive all booking   
app.get("/api/allbookingsarchive", async (req, res) => {
  console.log("Bookings retrieved"); // Debugging line
  try {
      // Fetch all bookings from the archive table without filtering by email
      const bookings = await ArchiveModel.find({});

      res.json({
          bookings: bookings,
          message: "Bookings fetched successfully from archive"
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching bookings from archive" });
  }
});

app.delete("/api/bookings/:id", async (req, res) => {
  console.log("Booking delete request received"); // Debugging line
  try {
      // Extract the booking ID from the request parameters
      const id = req.params.id;

      // Retrieve the booking before deletion to get the location and category
      const booking = await BookingModel.findById(id);
      if (!booking) {
          return res.status(404).json({ message: "Booking not found" });
      }

      // Delete the booking with the specified ID
      await BookingModel.findByIdAndDelete(id);

      // Increment capacity by 1 for the retrieved location and category
      await incrementCapacity(booking.carModel, booking.title, 1);

      res.json({
          message: "Booking deleted successfully"
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting booking" });
  }
});

//tsajel contact us 
app.post("/api/contact", async (req, res) => {
    try {
       const { email, errorType, specificError, message } = req.body;

       // Save contact form data to the database
       const contactUsData = new ContactUsModel({
         email,
         errorType,
         specificError,
         message,
       });
       await contactUsData.save();

       // Send email
       const { data, error } = await resend.emails.send({
            from: 'OACA <onboarding@resend.dev>',
            to: [email], // Send email to the provided email address
            subject: 'Contact Form Submission Confirmation',
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Contact Form Submission Confirmation</title>
              <style>
                body {
                  font-family: 'Arial', sans-serif;
                  line-height: 1.6;
                  background-color: #f9f9f9;
                  margin: 0;
                  padding: 0;
                }
                .container {
                  max-width: 600px;
                  margin: 20px auto;
                  padding: 20px;
                  background-color: #fff;
                  border-radius: 10px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                  color: #007bff;
                  text-align: center;
                }
                p {
                  margin: 10px 0;
                }
                .details {
                  border-top: 2px solid #007bff;
                  padding-top: 20px;
                }
                .detail-item {
                  margin-bottom: 10px;
                }
                .detail-label {
                  font-weight: bold;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Contact Form Submission Confirmation</h1>
                <p>Hello <strong> ${email} </strong> </p>
                <p>Your message has been received successfully.</p>
                <div class="details">
                  <div class="detail-item">
                    <span class="detail-label">Error Type:</span> ${errorType}
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Specific Error:</span> ${specificError}
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Message:</span> ${message}
                  </div>
                </div>
              </div>
            </body>
            </html>
            `,
        });

        if (error) {
            console.error({ error });
            // Handle email sending error
        } else {
            console.log({ data });
            // Email sent successfully
        }

       res.status(201).json({ message: "Contact form submitted successfully." });
    } catch (error) {
       res.status(500).json({ error: "An error occurred while submitting the contact form." });
    }
});

   
   app.get("/api/contacts", async (req, res) => {
       try {
           // Query the database for all contact form submissions
           const contacts = await ContactUsModel.find({});
   
           // Send the contacts in the response
           res.status(200).json({ contacts });
       } catch (error) {
           console.error("Error fetching contacts:", error);
           res.status(500).json({ error: "An error occurred while fetching contacts." });
       }
   });

   app.get("/api/contact", async (req, res) => {
    console.log("Contact retrieval initiated"); // Debugging line
    try {
        // Extract the email from the query parameters
        const { email } = req.query;
        console.log(`Fetching contact for email: ${email}`); // Debugging line

        // Fetch contacts for the specified email
        const contact = await ContactUsModel.find({ email: email });

        res.json({
            contact: contact,
            message: "Contact fetched successfully"
        });
    } catch (error) {
        console.error("Error fetching contact:", error);
        res.status(500).json({ message: "Error fetching contact" });
    }
});


   
   app.delete("/api/contacts/:id", async (req, res) => {
    try {
        // Extract the contact ID from the request parameters
        const contactId = req.params.id;

        // Find and delete the contact by its ID
        const result = await ContactUsModel.findByIdAndDelete(contactId);

        // Check if the contact was found and deleted
        if (result) {
            // Send a success message
            res.status(200).json({ message: "Contact deleted successfully." });
        } else {
            // Send an error message if the contact was not found
            res.status(404).json({ error: "Contact not found." });
        }
    } catch (error) {
        console.error("Error deleting contact:", error);
        // Send a server error message
        res.status(500).json({ error: "An error occurred while deleting the contact." });
    }
});

const secretKey = process.env.SECRET_KEY;

app.get('/getSecretKey', (req, res) => {
  res.json({ secretKey });
});


app.post('/api/sendVerificationCode', async (req, res) => {
  const { email } = req.body;
  try {
      // Generate a verification code (for simplicity, a random number)
      const verificationCode = Math.floor(Math.random() * 900000) + 100000;
      // Store the verification code in the user's session or database temporarily
        // For simplicity, we'll just store it in the session
      req.session.verificationCode = verificationCode;
  
      // Send the verification code to the user's email using Resend
      // Assuming the axios.post method handles headers internally
      const { data, error } = await resend.emails.send({
       from: 'OACA <onboarding@resend.dev>',
       to: [email],
       subject: 'YourAppName - Verification Code',
       html: `
         <!DOCTYPE html>
         <html lang="en">
         <head>
             <meta charset="UTF-8">
             <meta name="viewport" content="width=device-width, initial-scale=1.0">
             <title>YourAppName - Verification Code</title>
             <style>
                 body {
                     font-family: 'Arial', sans-serif;
                     background-color: #f4f4f4;
                     margin: 0;
                     padding: 0;
                 }
                 .container {
                     max-width: 600px;
                     margin: 20px auto;
                     padding: 20px;
                     background-color: #fff;
                     border-radius: 10px;
                     box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                 }
                 h1 {
                     color: #007bff;
                     text-align: center;
                 }
                 p {
                     margin: 10px 0;
                     line-height: 1.6;
                 }
                 .verification-code {
                     font-size: 18px;
                     margin-bottom: 20px;
                 }
             </style>
         </head>
         <body>
             <div class="container">
                 <h1>YourAppName - Verification Code</h1>
                 <p class="verification-code">Hello,</p>
                 <p class="verification-code">Your verification code is: <strong>${verificationCode}</strong></p>
                 <p class="verification-code">Please use this code to verify your email.</p>
                 <p class="verification-code">Thank you,</p>
                 <p class="verification-code">YourAppName Team</p>
             </div>
         </body>
         </html>
       `,
      });
  
      if (error) {
        console.error("Error sending verification code:", error);
        // Ensure the error response is correctly formatted
        res.status(500).json({ message: "Error sending verification code.", error: error.response.data });
      } else {
        console.log("Email sent successfully:", data);
        res.json({ message: "Verification code sent successfully." });
      }
  } catch (error) {
      console.error("Error sending verification code:", error);
      // Ensure a generic error response is sent in case of an unexpected error
      res.status(500).json({ message: "Error sending verification code." });
  }
 });
 
 app.post('/api/verifyCode', async (req, res) => {
  const { email, verificationCode } = req.body;
  const storedCode = verificationCode;
  if (storedCode && storedCode.toString() === verificationCode.toString()) {
     res.json({ verified: true });
  } else {
     res.json({ verified: false });
  }
 });
app.post('/api/checkEmail', async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });
  res.json({ exists: !!user });
 });

 app.put('/api/forgetpassword/:email', async (req, res) => {
  const { email } = req.params;
  const { password } = req.body;

  try {
    // Attempt to find the user by email and update their password
    const user = await UserModel.findOneAndUpdate({ email }, { password }, { new: true });

    // If no user is found with the given email, return a 404 response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If the update is successful, return a success message
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    // If an error occurs during the update process, log the error and return a 500 response
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Error updating password" });
  }
});

// Route to handle creating a new Variable document
app.post('/api/variables', async (req, res) => {
  try {
    // Extract data from the request body
    const { sfaxcap, djcap, ecop, luxp, hadp, sfaxcaplux, sfaxcapeco, sfaxcaphad,djcaplux,djcaphad ,djcapeco} = req.body;

    // Validate the data (simplified example, consider using Mongoose validation)
    if (!sfaxcap ||!djcap ||!ecop ||!luxp ||!hadp ||!sfaxcaplux ||!sfaxcapeco ||!sfaxcaphad ||!djcaphad  ||!djcapeco ||!djcaplux) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create a new Variable document
    const newVariable = new Variable({
      sfaxcap,
      djcap,
      ecop,
      luxp,
      hadp,
      sfaxcaplux,
      sfaxcapeco,
      sfaxcaphad,
      djcaphad,
      djcapeco,
      djcaplux,
    });

    // Save the new Variable document to the database
    const savedVariable = await newVariable.save();

    res.status(201).json(savedVariable); // Respond with the saved document
  } catch (error) {
    console.error('Error creating variable:', error);
    res.status(500).json({ error: 'Failed to create variable' });
  }
});
// Route to handle creating or updating a new Variable document
app.patch('/api/variables', async (req, res) => {
  try {
    // Extract data from the request body
    const { sfaxcap, djcap, ecop, luxp, hadp, sfaxcaplux, sfaxcapeco, sfaxcaphad, djcaphad, djcapeco, djcaplux } = req.body;

  

    // Use a fixed id for the Variable document
    const fixedId = '663f716275995050b1cd3bec';

    // Check if the Variable document already exists
    let variable = await Variable.findOne({ _id: fixedId });

    if (!variable) {
      // If not found, create a new Variable document
      variable = new Variable({
        sfaxcap,
        djcap,
        ecop,
        luxp,
        hadp,
        sfaxcaplux,
        sfaxcapeco,
        sfaxcaphad,
        djcaphad,
        djcapeco,
        djcaplux,
        _id: fixedId, // Explicitly set the id to the fixed value
      });
    } else {
      // If found, update the existing Variable document
      variable.sfaxcap = sfaxcap || variable.sfaxcap;
      variable.djcap = djcap || variable.djcap;
      variable.ecop = ecop || variable.ecop;
      variable.luxp = luxp || variable.luxp;
      variable.hadp = hadp || variable.hadp;
      variable.sfaxcaplux = sfaxcaplux || variable.sfaxcaplux;
      variable.sfaxcapeco = sfaxcapeco || variable.sfaxcapeco;
      variable.sfaxcaphad = sfaxcaphad || variable.sfaxcaphad;
      variable.djcaphad = djcaphad || variable.djcaphad;
      variable.djcapeco = djcapeco || variable.djcapeco;
      variable.djcaplux = djcaplux || variable.djcaplux;
    }

    // Save the Variable document to the database
    const savedVariable = await variable.save();

    res.status(201).json(savedVariable); // Respond with the saved document
  } catch (error) {
    console.error('Error creating or updating variable:', error);
    res.status(500).json({ error: 'Failed to create or update variable' });
  }
});
app.get('/api/variables', async (req, res) => {
  try {
    // Extract the fixed ID from the request parameters
    const fixedId = '663f716275995050b1cd3bec';

    // Find the Variable document by the fixed ID
    const variable = await Variable.findOne({ _id: fixedId });

    if (!variable) {
      // If not found, respond with an appropriate message
      return res.status(404).json({ error: 'Variable not found' });
    }

    // Respond with the found Variable document
    res.status(200).json(variable);
  } catch (error) {
    console.error('Error fetching variable:', error);
    res.status(500).json({ error: 'Failed to fetch variable' });
  }
});




// POST endpoint to decrement capacity
app.post('/api/decrement-capacity', async (req, res) => {
  const { location, category } = req.body;

  // Map location and category to the specific database field
  const fieldMap = {
    'Sfax–Thyna International Airport': {
      'Economy Zone': 'sfaxcapeco',
      'Premium Zone': 'sfaxcaplux',
      'Handicap Zone': 'sfaxcaphad'
    },
    'Djerba–Zarzis international Airport': {
      'Economy Zone': 'djcapeco',
      'Premium Zone': 'djcaplux',
      'Handicap Zone': 'djcaphad'
    }
  };

  // Check if the provided location and category are valid
  if (!fieldMap[location] || !fieldMap[location][category]) {
    return res.status(400).json({ error: 'Invalid location or category' });
  }

  const fieldToUpdate = fieldMap[location][category];

  try {
    // Find the Variable document and decrement the specific field
    const updatedVariable = await Variable.findOneAndUpdate(
      { _id: '663f716275995050b1cd3bec' }, // Assuming a fixed ID for simplicity
      { $inc: { [fieldToUpdate]: -1 } }, // Decrement the capacity by 1
      { new: true } // Return the updated document
    );

    if (!updatedVariable) {
      return res.status(404).json({ error: 'Variable not found' });
    }

    // Respond with the updated Variable document
    res.status(200).json(updatedVariable);
  } catch (error) {
    console.error('Error updating variable:', error);
    res.status(500).json({ error: 'Failed to update variable' });
  }
});


app.post('/api/count-expired-reservations', async (req, res) => {
  try {
    const currentDate = new Date();
    const expiredReservations = await BookingModel.aggregate([
      {
        $match: {
          bookingEndDate: { $lt: currentDate }
        }
      },
      {
        $group: {
          _id: {
            location: '$carModel',
            category: '$title'
          },
          count: { $sum: 1 }
        }
      }
    ]);

    for (const reservation of expiredReservations) {
      const { location, category } = reservation._id;
      const count = reservation.count;
      await incrementCapacity(location, category, count);
    }

    res.status(200).json({ message: 'Expired reservations counted and processed' });
  } catch (error) {
    console.error('Error counting expired reservations:', error);
    res.status(500).json({ error: 'Failed to count expired reservations' });
  }
});



async function incrementCapacity(location, category, count) {
  const fieldMap = {
    'Sfax–Thyna International Airport': {
      'Economy Zone': 'sfaxcapeco',
      'Premium Zone': 'sfaxcaplux',
      'Handicap Zone': 'sfaxcaphad'
    },
    'Djerba–Zarzis international Airport': {
      'Economy Zone': 'djcapeco',
      'Premium Zone': 'djcaplux',
      'Handicap Zone': 'djcaphad'
    }
  };

  const fieldToUpdate = fieldMap[location][category];

  if (!fieldToUpdate) {
    throw new Error('Invalid location or category');
  }

  try {
    const updatedVariable = await Variable.findOneAndUpdate(
      { _id: '663f716275995050b1cd3bec' },
      { $inc: { [fieldToUpdate]: count } },
      { new: true }
    );

    if (!updatedVariable) {
      throw new Error('Variable not found');
    }

    console.log(`Incremented capacity for ${location} - ${category} by ${count}`);
  } catch (error) {
    console.error('Error incrementing capacity:', error);
    throw error;
  }
}




app.delete('/api/delete-expired-reservations', async (req, res) => {
  try {
    const currentDate = new Date();
    const result = await BookingModel.deleteMany({
      bookingEndDate: { $lt: currentDate }
    });

    res.status(200).json({ message: `Deleted ${result.deletedCount} expired reservations` });
  } catch (error) {
    console.error('Error deleting expired reservations:', error);
    res.status(500).json({ error: 'Failed to delete expired reservations' });
  }
});
 


app.listen(port, () => console.log(`Listening on port ${port}`));