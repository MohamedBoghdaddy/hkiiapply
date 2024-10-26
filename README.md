# HKI IApply 🤖

![Build](https://img.shields.io/github/actions/workflow/status/MohamedBoghdaddy/hkiiapply/ci.yml)
![License](https://img.shields.io/github/license/MohamedBoghdaddy/hkiiapply)

**HKI IApply** is an AI-powered platform that automates the job application process, helping users apply to thousands of jobs effortlessly. This allows users to focus on interview preparation and career development, while the platform handles the time-consuming application process. 💼

## ⚙️ Tech Stack
- **Stack**: MERN
- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **AI Integration**: Python-based algorithms for job matching and application automation
- **Subscription & Payments**: Razorpay
- **Deployment**: Vercel for the frontend, and AWS for backend services

## 🚀 Features

- **AI-Driven Job Search and Application** 💡: Automatically searches for relevant jobs and applies on behalf of the user based on their preferences and profile.
- **Global Reach Across Multiple Countries** 🌎: Users can select multiple countries for job applications, providing opportunities worldwide.
- **Detailed Analytics and Tracking** 📊: Get insights into application progress, success rates, and more through a personalized dashboard.
- **Subscription-Based Service Model** 💳: Access job application services through a flexible subscription plan with automated payment processing.

## 💼 Application Workflow

The application workflow is streamlined to provide a hassle-free job search experience. Here are some visuals to illustrate the process:

![Job Application Process](https://path/to/application-process-gif.gif)  
*Automated job application workflow*

![Dashboard](https://path/to/dashboard-screenshot.png)  
*Dashboard displaying analytics and tracking of job applications*

## 🛠️ Installation

To set up HKI IApply locally, follow these steps:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/MohamedBoghdaddy/hkiiapply.git
   cd hkiiapply
   ```

2. **Install Dependencies**:

   - **Backend**:
     ```bash
     cd backend
     npm install
     ```

   - **Frontend**:
     ```bash
     cd ../frontend
     npm install
     ```

3. **Set Up Environment Variables**:

   Create a `.env` file in the backend directory with the following:

   ```env
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   RAZORPAY_API_KEY=your_razorpay_api_key
   ```

4. **Start the Application**:

   - **Backend**:
     ```bash
     npm start
     ```

   - **Frontend**:
     ```bash
     cd ../frontend
     npm start
     ```

   The frontend should now be running on `http://localhost:3000` and the backend on `http://localhost:5000`.

## 💻 Usage

1. **Register and Subscribe**: Sign up and choose a subscription plan to start using the job application automation service.
2. **Set Preferences**: Define job titles, locations, and other preferences.
3. **Start Automating**: Access the dashboard to track application progress, view detailed analytics, and adjust preferences.

## 📜 License

This project is licensed under the MIT License. See the [`LICENSE`](LICENSE) file for more details.

---

**HKI IApply** is your personal job application assistant, using AI to find the right opportunities for you across the globe. Focus on what matters—preparing for interviews—while we handle the job search.
