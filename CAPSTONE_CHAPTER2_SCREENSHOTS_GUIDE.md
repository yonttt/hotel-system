# CAPSTONE CHAPTER 2 - SOFTWARE PRODUCT DISPLAY
## Revised Screenshot Guilde: Core User & Operational Flows (Alur Pengguna)

**MENTOR & FLOW REMINDERS:**
1. **Text Readability:** ONLY capture the specific component/card/form, NOT the whole screen. Zoom your browser to 110%-125% before snipping (Windows + Shift + S).
2. **Figure Captions:** Put the "Figure 2.X" caption directly under the image in your Word document.
3. **No Backend Code:** Only take screenshots of the React Frontend (Customer Website or Admin Dashboard).
4. **Focus on the Journey:** The screenshots are now ordered by how a real user or staff member would interact with the system start-to-finish (Alur Pengguna).

---

## **PART 1: END-TO-END CUSTOMER JOURNEY (ALUR PENGGUNA)**
*This section demonstrates the core flow of a customer searching, booking, encountering validation, and getting assistance.*

### **1. Dynamic Booking Search Engine**
**Where to Screenshot:** On the Public Website HomePage, capture ONLY the horizontal booking search bar. 
**Figure Caption:** *Figure 2.1: Dynamic Booking Search Engine with Client-side Date Validation*
**Description:**
The core customer entry point is the Dynamic Booking Search Engine. Highlighting robust frontend engineering, this component performs strict client-side date validation before any server request is made (preventing past-date bookings). It utilizes URL Parameter tracking (`URLSearchParams`), which strictly binds the user's search criteria to the browser's URL, making search states securely bookmarkable and shareable.

### **2. Multi-step Automated Booking Wizard**
**Where to Screenshot:** On the Public Website Booking Page (Step 2 or 3). Capture the form and the pricing breakdown summary.
**Figure Caption:** *Figure 2.2: Multi-step Automated Booking Form with Real-time Pricing Calculation*
**Description:**
The booking flow utilizes a seamless multi-step wizard interface. From an IT perspective, this module dynamically retains complex state data across steps without page reloads. Using React's state memoization algorithms (`useMemo`), the system automatically calculates the total price in real-time by computing the exact date difference against room multipliers, ensuring precise financial accuracy prior to database submission.

### **3. Overbooking Prevention & Form Validation**
**Where to Screenshot:** On the Public Website Booking form, click 'Submit' without filling out required fields, or try booking past dates. Capture the red validation text warnings.
**Figure Caption:** *Figure 2.3: Client-Side Input Validation and Overbooking Prevention Architecture*
**Description:**
Data integrity is strictly enforced at the client level before any API transmission. The booking forms utilize robust state-driven validation logic to analyze data inputs in real-time. If critical parameters (such as conflicting dates or missing identifiers) are detected, the system blocks the database transaction layer and renders precise edge-case warnings. This proactive defense architecture prevents database corruption and guarantees 100% accurate guest profiles.

### **4. AI Chatbot Interface (Eva)**
**Where to Screenshot:** Open the Public Website (`WEBSITE-Hotel`). Click the chat icon to open "Eva". Type a test message so the bot responds. Screenshot ONLY the chat window box.
**Figure Caption:** *Figure 2.4: Real-time AI Concierge Chatbot for Automated Customer Service*
**Description:**
The system integrates an intelligent Artificial Intelligence (AI) Chatbot named Eva to serve as a digital concierge. Built with real-time state management, the chatbot handles asynchronous API calls to the backend natural language processing module. It provides instant, automated responses to guest inquiries regarding hotel facilities, room availability, and policies, significantly reducing the workload on human staff and improving 24/7 guest engagement.

---

## **PART 2: CORE OPERATIONAL FLOW (ALUR OPERASIONAL ADMIN)**
*This section demonstrates how staff securely authorize, monitor, check-in guests, and maintain the hotel flow behind the scenes.*

### **5. Secure Admin Login with Anti-Bot Protection**
**Where to Screenshot:** Run the Admin dashboard (`hotel-react-frontend`) and go to `/login`. Screenshot the login form with the Google reCAPTCHA widget visible.
**Figure Caption:** *Figure 2.5: Staff Authentication Interface with Google reCAPTCHA v2 Security*
**Description:**
The Staff Admin panel is secured through a robust authentication layer. To protect the system against automated brute-force attacks and credential stuffing, the login interface integrates Google reCAPTCHA v2. On the backend, this is coupled with IP-based rate-limiting middleware and JWT (JSON Web Token) role-based access control (RBAC), ensuring that only authorized staff can access operational data.

### **6. Security Authentication Feedback (Error Notification)**
**Where to Screenshot:** On the Admin `/login`, type a wrong password and click Login. Capture the red error popup at the top/bottom of the screen.
**Figure Caption:** *Figure 2.6: Dynamic Security Feedback Loop for Invalid Authentication Attempts*
**Description:**
To ensure system transparency, the application incorporates a dynamic error-handling notification system. When an unauthorized access attempt occurs, the React frontend intercepts the HTTP 401 Unauthorized status code. It immediately renders a visually prominent, ephemeral error toast, providing instant security feedback to the user without interrupting the broader browser DOM state.

### **7. Centralized Admin Dashboard Analytics**
**Where to Screenshot:** Log into the Admin dashboard and capture the overview section (numbers, charts, or today's summaries).
**Figure Caption:** *Figure 2.7: Centralized Admin Dashboard with Real-time System Metrics*
**Description:**
The Admin Dashboard acts as the central command center for hotel operations. Designed using a modular React architecture, it aggregates data across the entire hotel ecosystem—fetching real-time statistics via REST APIs. This provides management with a high-level, data-driven overview of current occupancy rates, system health, and daily check-ins, optimizing data visibility.

### **8. Centralized Reservation Management System**
**Where to Screenshot:** In the Admin dashboard -> **Informasi Reservasi**. Capture the data table showing bookings and the search/filter inputs.
**Figure Caption:** *Figure 2.8: Centralized Database Interface for Reservation Tracking and Management*
**Description:**
The Reservation Management module provides a powerful grid interface for staff to manipulate the central booking database. It features dynamic filtering, searching, and pagination logic, allowing staff to handle thousands of records without browser performance degradation. This centralized approach guarantees data integrity across the platform and eliminates the risks of double-booking.

### **9. Front Office Transaction & Synchronization**
**Where to Screenshot:** In the Admin dashboard -> **Form Transaksi**. Capture the form showing guest check-in selection, payment method, and charges.
**Figure Caption:** *Figure 2.9: Automated Check-in Transaction Form with System-wide Data Synchronization*
**Description:**
The Transaction module finalizes the digital check-in procedure. It operates as a complex state machine that synchronizes data across multiple modules: guest registry, room allocation, and financial ledgers. By wrapping these operations within a strict validation layer, the system prevents orphaned records and enforces strict financial accountability for all hotel transactions.

### **10. Live Room Status Board (Status Kamar FO)**
**Where to Screenshot:** In the Admin dashboard -> **Status Kamar FO** page. Capture the grid of room cards showing different colors.
**Figure Caption:** *Figure 2.10: Real-time Interactive Room Status Visualization Board*
**Description:**
To maximize Front Office efficiency, the system includes a Live Room Status Board. This module replaces traditional manual tracking with a dynamic, color-coded visual interface. Staff can instantly identify room availability, housekeeping status, and maintenance blocks. The component leverages React's state management to provide instant UI updates, ensuring synchronized operations.

### **11. Dynamic Housekeeping State Management**
**Where to Screenshot:** In the Admin dashboard -> **Housekeeping**. Capture the task list showing room statuses and update buttons.
**Figure Caption:** *Figure 2.11: Asynchronous Housekeeping Operations and Status Synchronization*
**Description:**
Operational fluidity between departments is maintained via the Housekeeping module. Technically, this component acts as a high-frequency state editor. When a staff member updates a room's physical condition (e.g., from 'Dirty' to 'Clean'), the frontend dispatches an asynchronous PATCH request to the backend. This instantly overwrites the room's multidimensional status across all Front Office matrices.

### **12. Automated Night Audit Processor**
**Where to Screenshot:** In the Admin dashboard -> **Night Audit**. Capture the interface showing the process button and the date selection.
**Figure Caption:** *Figure 2.12: Automated Night Audit Module for Batch Financial Processing*
**Description:**
The Night Audit module is a cornerstone of the hotel's financial IT architecture. Designed for scheduled batch processing, this component triggers complex server-side Python scripts that automatically post daily room charges, aggregate taxes, and close financial ledgers. By automating these routines, the system mitigates human calculation errors and synchronizes multi-departmental financial data securely.

---

## **PART 3: ADVANCED PLATFORM CAPABILITIES (MODUL TAMBAHAN)**
*These final systems highlight B2B (Business to Business) scaling and CMS flexibilities.*

### **13. Scalable Group Booking Module**
**Where to Screenshot:** In the Admin dashboard -> **Informasi Group Booking**. Capture a section showing a group reservation and its allocated rooms.
**Figure Caption:** *Figure 2.13: Scalable Group Reservation and Mass Room Allocation Module*
**Description:**
To support B2B (Business-to-Business) operations, the system includes a dedicated Group Booking Module. Technically, this handles complex many-to-one database relationships, linking a single corporate entity to multiple room array allocations. This automated grouping minimizes data-entry redundancy and streamlines mass check-ins for large events.

### **14. Integrated CMS (Content Management System)**
**Where to Screenshot:** In the Admin dashboard -> **Website Editor**. Capture the form where admins edit the website text/heroes.
**Figure Caption:** *Figure 2.14: Integrated Content Management System (CMS) for Dynamic Website Updates*
**Description:**
The system architecture includes a headless-style CMS integration. Authorized administrators can dynamically update public-facing frontend content (such as Hero banners or Special Offers) directly from the admin panel. The customer website fetches these configurations dynamically on component mount, proving a high degree of system flexibility without requiring source-code modifications or re-deployments.