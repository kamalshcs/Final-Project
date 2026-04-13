# PathFinder Ontario 🌲
**A Multi-Page Dynamic Web Portal for Trail Discovery**

PathFinder Ontario is a niche application designed for hikers in the Greater Toronto Area. It features a curated gallery of 8 iconic Ontario trails, providing real-time weather integration and search functionality to help users plan their outdoor adventures efficiently.

**Live Project URL:** [Insert your Vercel/GitHub Pages Link here]

---

## 📋 Project Pitch

### **User Persona**
* **Who:** Active individuals and weekend warriors living in Brampton and the GTA who want to explore local nature.
* **The Problem:** It is difficult to quickly find trail lengths (kms) and current weather conditions for specific locations in a single, clean interface without navigating away to heavy weather sites.

### **The Solution**
A lightweight "Trail Portal" featuring:
1.  **A Searchable Gallery:** Instantly filter 8 curated trails by name or distance.
2.  **Interactive Cards:** Clicking a trail card triggers a dynamic view showing the trail's aesthetic and real-time weather stats.
3.  **Live Weather Integration:** Uses the Fetch API to provide "live-time" hiking conditions for the trail's specific city.

---

## 🚀 Deployment & Workflow

### **Deployment**
This application is deployed on **Vercel** via GitHub integration.

### **Git Story (Atomic Commits)**
1. `feat: initial project pitch and setup`
2. `feat: create basic html structure for 4 views`
3. `style: implement global css variables and design system`
4. `feat: build local data array with 8 ontario trails`
5. `feat: render trail cards dynamically in the gallery`
6. `feat: implement real-time search for names and kms`
7. `feat: create modal for trail details and photos`
8. `feat: integrate fetch api for live trail weather`
9. `feat: add custom form validation logic`
10. `docs: finalize challenges and solutions section`

---

## 🧠 Challenges & Solutions

**The Challenge:** I wanted the weather data to be specific to the trail the user clicked, rather than just showing one general location. Implementing this within a dynamic gallery meant I couldn't "hard-code" the API calls for each trail.

**The Solution:** I solved this by creating a single asynchronous function that accepts a `location` parameter. When a user clicks a trail card, the event listener passes that trail's specific location (e.g., "Caledon" or "Hamilton") into the Fetch request URL using template literals. This allows one function to dynamically serve weather data for all 8 trails.