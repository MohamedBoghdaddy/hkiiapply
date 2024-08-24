import React, { useState, useEffect } from "react";
import "../styles/Home.css";

const Pricing = () => {
  return (
    <div className="container">
      <div className="row align-items-center h-100">
        <div className="col-lg-12 col-md-12">
          <div className="text-center">
            <h3 className="heading_cmn mb-4">Choose Your Package</h3>
            <p className="semi_heading mb-2 text-center">
              We use tomorrow’s technology to get you today’s job opportunities!
              Choose your package and get ready to fly with iApply!
            </p>
          </div>
        </div>
        <div className="col-lg-8 m-auto">
          <div className="row">
            <div className="col-md-6 mt-4">
              <div className="price_wrpr1" style={{ height: "100%" }}>
                <div className="price_box fr_box" style={{ height: "100%" }}>
                  <div
                    className="price_details1 text-center"
                    style={{
                      height: "100%",
                      display: "flex",
                      flex: 1,
                      flexDirection: "column",
                    }}
                  >
                    <h3>Basic</h3>
                    <h4 className="d-flex align-items-center justify-content-center flex-column">
                      <p className="mb-0 price_main">
                        $1 <span></span>
                      </p>
                    </h4>
                    <p className="PackagePeriod">Billed Monthly</p>
                    <ul>
                      <li>
                        Artificial Intelligence powered automated CV
                        Distribution to 20 Authentic HR Managers &amp;
                        Recruiters Email.
                      </li>
                      <li>
                        Upon the package renewal, 20 CV Distribution will be
                        done to new and different authentic emails.
                      </li>
                      <li>Select 3 Preferred Countries</li>
                      <li>Select 3 Preferred Job Title</li>
                      <li>One Click Resume Submission</li>
                      <li>No Spam Emails</li>
                      <li>User Dashboard &amp; Analytic</li>
                      <li>Cancel Subscription at Any time</li>
                    </ul>
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{ marginTop: "auto" }}
                    >
                      <button
                        type="button"
                        className="get_started btn btn-primary m-auto"
                        style={{ width: "184px" }}
                      >
                        Get STARTED
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 mt-4">
              <div className="price_wrpr" style={{ height: "100%" }}>
                <div className="price_box standard_box">
                  <div className="price_details text-center">
                    <h3>
                      <span>Premium</span>
                    </h3>
                    <h4 className="d-flex align-items-center justify-content-center flex-column">
                      <p className="mb-0 price_main">
                        $1<span className="offer"></span>
                      </p>
                    </h4>
                    <p className="PackagePeriod">Billed Monthly</p>
                  </div>
                  <ul>
                    <li>Automated Applying Jobs by Artificial Intelligence</li>
                    <li>Applying Upto 40 Realtime Available Jobs</li>
                    <li>Select Upto 3 Preferred Countries</li>
                    <li>Select Upto 3 Preferred Job Titles</li>
                    <li>User Dashboard &amp; Analytics</li>
                    <li>Jobs Submission Analytics &amp; Notifications</li>
                    <li>
                      Unlimited CV distribution, In case of the non-availability
                      of the Realtime Job in the preferred country
                    </li>
                    <li>Cancel Subscription at Anytime&nbsp;</li>
                  </ul>
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ marginTop: "auto" }}
                  >
                    <button
                      type="button"
                      className="continue btn btn-primary m-auto"
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Pricing;
