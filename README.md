Welcome to the Landing Page!
![IMG2](https://github.com/user-attachments/assets/d770ab75-0293-47b1-81bf-51130b99fcea)
# Project Name - FLOWOPT
Organize effortlessly, achieve flawlessly with FlowOpt!
# Navigation Elements:
- Settings icon that redirects to settings page
- Logout icon to exit certain accountback to login page.\
# Labelled Button

Frontend:
[🔗 **Live Demo**](https://nomcebolmncina.github.io/FlowOpt/)

Backend:
[🔗 **Live Demo**](https://flowopt.onrender.com)

# Inpiration

This project was inspired by my background in industrial engineering, where efficient workflow management is crucial for productivity. Recognizing the need for a customizable in-house solution, I wanted to develop an application that could adapt to our specific operational requirements. FlowOpt was born from the vision of creating a flexible tool that simplifies time management, enhances task delegation, and evolves alongside our workplace needs—eliminating the limitations of off-the-shelf software. By integrating features like workflow visualization and real-time task tracking, the app empowers teams to optimize processes dynamically, bridging the gap between industrial engineering principles and practical, day-to-day execution.

This project was made within the time frame of February to March 2025. Improvements are set to be done early April.

# 3 Key Features
![SC1](https://github.com/user-attachments/assets/5c4c1ec9-1981-4cb9-9fd4-cb97d42b4ee4)

Login/Signup: Individuals are able to create personal accounts especially within a company as this app was created for such a setting. Supervisors may have it as a tracking system for projects they may have delegated to team members and this details how long, what project and when it was assigned to them.

![SC2](https://github.com/user-attachments/assets/1ded0f0d-95cd-40b5-b50d-1efb91a41a5d)

Add Tasks: Here it is clear exactly how a user is supposed to enter their preferred data and are able to include team member for team projects and a calendar provided to select date and time of said project, as well as what may be needed my assignee for said project.

![SC3](https://github.com/user-attachments/assets/0797958e-acf0-4884-ac36-0beca8743264)

Workflow Visualization: Workflow efficiency is represented in visualization graph so as to easily make analysis of proper time management whilst doing taks. 
Tasks are listed at the bottom, with a feature of enabling reminders from 24hrs before due date for longer projects, and an hour reminder for daily short projects.

🛠 Installation

### Prerequisites
- Python 3.8+
- SQLite (included with Python)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/flowopt.git
   cd flowopt
   ```

2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Initialize database:
   ```bash
   python init_db.py
   ```

5. Run the application:
   ```bash
   python app.py
   ```
   Access at: `http://localhost:5000`

## 🚀 Usage

1. **Account Setup**:
   - Register team members via `/signup`
   - Assign roles through the admin panel (future feature)

2. **Task Workflow**:
   ```mermaid
   graph LR
   A[Add Task] --> B[Assign Time/Dependencies]
   B --> C[Delegate to Team]
   C --> D[Track Progress]
   ```

3. **Key Shortcuts**:
   - `Ctrl+Shift+N`: Quick-add task (customize in settings)
   - Export data as JSON/CSV from Settings

## 🤝 Contributing

We welcome adaptations for industrial engineering applications! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/improvement`)
5. Open a Pull Request

**Suggested Improvements**:
- Gantt chart integration
- Equipment resource scheduling
- OEE (Overall Equipment Effectiveness) tracking module

## 🔗 Related Projects

- [ProcessOptimizer](https://github.com/industrial-eng/process-optimizer) - Bottleneck analysis toolkit
- [TimeStudyPro](https://github.com/ie-tools/timestudy) - Industrial time-motion study app
- [LeanFlow](https://github.com/lean-manufacturing/leanflow) - Kanban board for manufacturing

## 📜 Licensing

Distributed under the **MIT License**. See `LICENSE.md` for details.

This is a solo Project by Nomcebo Lunga Mncina

LinkedIn: https://sz.linkedin.com/in/nomcebo-mncina-bb6265306

Github: https://github.com/NomceboLMncina

Twitter: https://x.com/mcebo_lu

Github Repository: https://github.com/NomceboLMncina/FlowOpt
