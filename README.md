# 🐾 Pet Adoption Web Application – Frontend

This repository contains the **client-side (frontend)** of the **Pet Adoption Web Application**, developed as a final project.

The application provides an intuitive and user-friendly interface for managing pet adoptions, allowing users to browse animals, publish pets for adoption, and track adoption requests.

---

## 🎯 Project Goals

- Create a modern, responsive user interface for a pet adoption system  
- Support different user roles (animal owners & adopters)  
- Demonstrate frontend architecture, routing, and state management  
- Focus on usability, accessibility, and clean UI/UX design  

---

## 🖥️ Technologies Used

- **React** (Functional Components & Hooks)
- **React Router DOM** – client-side routing
- **Material UI (MUI)** – UI components & styling
- **JavaScript (ES6+)**
- **CSS-in-JS (MUI `sx` props)**
- **Git & GitHub** – version control

---

## 📄 Pages & Features

### 🏠 Home Page
- Displays all available animals for adoption
- Live search and filtering
- Hover effects and responsive grid layout
- Navigation to animal details

### 🐶 Animal Details Page
- Detailed view of a selected animal
- Image, description, category, size, gender, location
- Owner contact information
- “Adopt Now” call-to-action

### ➕ Add Animal Page
- Form for publishing a new animal for adoption
- Client-side validation
- Image upload with preview
- Success feedback (Snackbar)
- Clean and structured layout

### 🐾 My Animals
- Displays animals published by the current user
- Management actions (view / edit / delete – mock)
- Status indicators
- Centered and responsive layout

### ❤️ My Adoption Requests
- Displays adoption requests submitted by the user
- Request status (Pending / Approved / Rejected)
- Navigation to animal details
- Cancel request option (mock)

---

## 🎨 UI / UX Highlights

- Fully responsive design (desktop, tablet, mobile)
- Dark theme with consistent color palette
- Clear navigation with hamburger menu
- Contextual page descriptions for better usability
- Accessible and readable typography

---

## 📂 Project Structure

```text
src/
 ├─ components/      # Reusable UI components
 ├─ pages/           # Application pages
 ├─ App.js           # Routing configuration
 └─ index.js         # Application entry point
