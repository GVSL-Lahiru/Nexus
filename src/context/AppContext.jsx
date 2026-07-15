import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

const DEFAULT_USERS = [
  { id: 'u1', name: 'Liam Chen', email: 'intern@company.com', role: 'Intern', team: 't1', status: 'Active', avatar: 'LC' },
  { id: 'u2', name: 'Sophia Rodriguez', email: 'senior@company.com', role: 'Senior Developer', team: 't2', status: 'Active', avatar: 'SR' },
  { id: 'u3', name: 'Marcus Vance', email: 'admin@company.com', role: 'Admin', team: 'Management', status: 'Active', avatar: 'MV' },
  { id: 'u4', name: 'Ethan Harper', email: 'ethan@company.com', role: 'Intern', team: '', status: 'Pending Setup', avatar: 'EH' }
];

const DEFAULT_TEAMS = [
  { id: 't1', name: 'Alpha-Phoenix', members: ['u1'], projectId: 'p1' },
  { id: 't2', name: 'Beta-Legacy', members: ['u2'], projectId: 'p2' }
];

const DEFAULT_PROJECTS = [
  { id: 'p1', name: 'Project Phoenix', desc: 'Migration of the primary company monolith to a containerized microservices structure.', techStack: 'Docker, Kubernetes, Spring Boot, React', repos: 'git@github.com:enterprise/phoenix-core.git' },
  { id: 'p2', name: 'Project Apollo', desc: 'Refactoring and documentation of the legacy enterprise billing modules.', techStack: 'Java 8, Oracle DB, SOAP Web Services', repos: 'git@github.com:enterprise/apollo-billing.git' }
];

const DEFAULT_TASKS = [
  { id: 'tsk1', title: 'Configure IDE settings for Phoenix', desc: 'Import the shared code formatter settings and configure checkstyle guidelines for Project Phoenix.', status: 'To Do', teamId: 't1', assigneeId: 'u1', plan: '', feedback: '' },
  { id: 'tsk2', title: 'Verify Local Docker Containers', desc: 'Pull the core database containers, run setup scripts, and verify docker-compose configurations.', status: 'In Progress', teamId: 't1', assigneeId: 'u1', plan: 'I plan to pull the docker-compose file from main, run docker-compose up -d, and run seed SQL files.', feedback: '' },
  { id: 'tsk3', title: 'Map SOAP Endpoints in Apollo', desc: 'Read legacy WSDL files and create an endpoint map spreadsheet for documentation.', status: 'In Review', teamId: 't2', assigneeId: 'u2', plan: 'Read billing-v2.wsdl, extract path routes, format into mapping sheet.', feedback: '' },
  { id: 'tsk4', title: 'Set up VPN credentials', desc: 'Submit VPN request ticket through ITSM portal and configure FortiClient profile.', status: 'Completed', teamId: 't1', assigneeId: 'u1', plan: 'Submit requested details to IT desk, download client, test connections.', feedback: '' }
];

const DEFAULT_DOCUMENTS = [
  { id: 'doc1', title: 'Intelligent IDE Configuration Guide', category: 'Required', content: '# IDE Configuration Guidelines\n\nWelcome to Nexus! To maintain a clean and standardized codebase, you must configure your IDE with our project standards.\n\n### 1. Code Style Formatter\n- Download `eclipse-java-google-style.xml` from the developer portal.\n- In your IDE (IntelliJ or VS Code), import the code formatting profile under preferences.\n- Set automatic tab size to 2 spaces (no tabs).\n\n### 2. Checkstyle Rules\n- Enable checkstyle checking on build.\n- Set severity level to "Warning" for spacing and "Error" for unused imports or variables.\n\n### 3. Git Hook Setup\n- Run `./scripts/install-hooks.sh` to initialize pre-commit hooks that format your files on save.', readBy: ['u2'] },
  { id: 'doc2', title: 'Docker Development Environments', category: 'Required', content: '# Local Environment Setup with Docker\n\nAll primary microservices for Project Phoenix run locally using container orchestration. Follow these steps:\n\n### Prerequisites\n- Install **Docker Desktop** (version 4.2+).\n- Allocate at least 4GB of RAM and 2 CPUs in Docker resource configurations.\n\n### Setup Steps\n1. Run `git clone git@github.com:enterprise/phoenix-core.git`\n2. Navigate to directory: `cd phoenix-core/deploy`\n3. Execute command: `docker-compose up -d --build`\n\n### Verifying Setup\n- Access localhost:8080/health to ensure healthcheck returns 200 OK.\n- Admin DB panel is hosted at localhost:5050 (pgAdmin default login in docs).', readBy: [] },
  { id: 'doc3', title: 'Project Apollo Architecture Overview', category: 'Useful', content: '# Legacy Billing Architecture Overview\n\nProject Apollo is the legacy billing gateway of the platform.\n\n### Architecture Highlights\n- Structured as a monolithic EAR application.\n- Deployed on WildFly Application Server v10.\n- Integrates heavily with SOAP interfaces and Oracle DB package triggers.\n\n### Caution Guidelines\n- Never execute direct DML queries on tables prefixing `TBL_ACCNT_` without locking the sequence.\n- All database modifications must be done through SQL package procedures.', readBy: [] }
];

const DEFAULT_WORKFLOWS = [
  { id: 'wf1', taskId: 'tsk4', employeeId: 'u1', employeeNotes: 'VPN setup is complete and tested. I can connect to local dev servers.', adminNotes: 'Approved during initial onboarding.', status: 'Approved', timestamp: '2026-07-15T10:00:00Z' }
];

export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const local = localStorage.getItem('nexus_users');
    return local ? JSON.parse(local) : DEFAULT_USERS;
  });

  const [teams, setTeams] = useState(() => {
    const local = localStorage.getItem('nexus_teams');
    return local ? JSON.parse(local) : DEFAULT_TEAMS;
  });

  const [projects, setProjects] = useState(() => {
    const local = localStorage.getItem('nexus_projects');
    return local ? JSON.parse(local) : DEFAULT_PROJECTS;
  });

  const [tasks, setTasks] = useState(() => {
    const local = localStorage.getItem('nexus_tasks');
    return local ? JSON.parse(local) : DEFAULT_TASKS;
  });

  const [documents, setDocuments] = useState(() => {
    const local = localStorage.getItem('nexus_documents');
    return local ? JSON.parse(local) : DEFAULT_DOCUMENTS;
  });

  const [workflows, setWorkflows] = useState(() => {
    const local = localStorage.getItem('nexus_workflows');
    return local ? JSON.parse(local) : DEFAULT_WORKFLOWS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const local = localStorage.getItem('nexus_current_user');
    return local ? JSON.parse(local) : null;
  });

  const [notifications, setNotifications] = useState([
    { id: 'n1', title: 'Welcome to Nexus', message: 'Explore the onboarding dashboard, read required documentation, and review your assigned tasks.', read: false, time: '1 hour ago' }
  ]);

  useEffect(() => {
    localStorage.setItem('nexus_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('nexus_teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('nexus_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('nexus_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('nexus_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('nexus_workflows', JSON.stringify(workflows));
  }, [workflows]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('nexus_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('nexus_current_user');
    }
  }, [currentUser]);

  const addNotification = (title, message) => {
    setNotifications(prev => [
      { id: Date.now().toString(), title, message, read: false, time: 'Just now' },
      ...prev
    ]);
  };

  const login = (email, password) => {
    const foundUser = users.find(u => u.email === email && u.status === 'Active');
    if (foundUser) {
      setCurrentUser(foundUser);
      addNotification('Logged In', `Successfully logged in as ${foundUser.name} (${foundUser.role}).`);
      return { success: true, user: foundUser };
    }
    return { success: false, message: 'Invalid credentials or user setup is pending.' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const signup = (name, email, password, role, team) => {
    const newUser = {
      id: 'u' + (users.length + 1),
      name,
      email,
      role,
      team,
      status: 'Active',
      avatar: name.split(' ').map(n => n[0]).join('').toUpperCase()
    };
    setUsers(prev => [...prev, newUser]);
    addNotification('Account Created', `Created account for ${name} (${role}).`);
  };

  const toggleDocRead = (docId, userId) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        const readBy = doc.readBy || [];
        const isRead = readBy.includes(userId);
        return {
          ...doc,
          readBy: isRead ? readBy.filter(id => id !== userId) : [...readBy, userId]
        };
      }
      return doc;
    }));
  };

  const createDocument = (title, category, content) => {
    const newDoc = {
      id: 'doc' + (documents.length + 1),
      title,
      category,
      content,
      readBy: []
    };
    setDocuments(prev => [...prev, newDoc]);
    addNotification('Document Created', `New document "${title}" added to ${category}.`);
  };

  const editDocument = (docId, title, category, content) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        return { ...doc, title, category, content };
      }
      return doc;
    }));
    addNotification('Document Updated', `Document "${title}" has been updated.`);
  };

  const improveDocByAI = (content, instructText) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const appendedImprovement = `\n\n### [AI Assisted Additions: Refined for onboarding]\n*This section was auto-generated and improved based on the prompt: "${instructText || 'Enhance guidelines'}"*\n\n1. **Expected Success Metrics**: Developers should complete configuring this environment within the first 2 days.\n2. **Troubleshooting Tip**: If port bindings clash, edit the docker-compose yaml to map host ports to alternate channels (e.g. \`8081:8080\`).\n3. **Quick Command Cheat Sheet**:\n   - Check logs: \`docker-compose logs -f\`\n   - Stop container instance: \`docker-compose down\``;
        resolve(content + appendedImprovement);
      }, 1000);
    });
  };

  const inviteEmployee = (name, email, role, teamId) => {
    const newUser = {
      id: 'u' + (users.length + 1),
      name,
      email,
      role,
      team: teamId,
      status: 'Pending Setup',
      avatar: name.split(' ').map(n => n[0]).join('').toUpperCase()
    };
    setUsers(prev => [...prev, newUser]);
    addNotification('Invitation Sent', `Sent role invitation to ${name} (${role}). Status: Pending Setup.`);
  };

  const activatePendingUser = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, status: 'Active' };
      }
      return u;
    }));
    addNotification('User Activated', `User account activated.`);
  };

  const createTeam = (name, projectId) => {
    const newTeam = {
      id: 't' + (teams.length + 1),
      name,
      members: [],
      projectId
    };
    setTeams(prev => [...prev, newTeam]);
    addNotification('Team Created', `Created team "${name}".`);
  };

  const assignMemberToTeam = (userId, teamId) => {
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        return { ...t, members: [...new Set([...t.members, userId])] };
      }
      return t;
    }));
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, team: teamId };
      }
      return u;
    }));
    addNotification('Member Assigned', `Assigned member to team.`);
  };

  const unassignMemberFromTeam = (userId, teamId) => {
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        return { ...t, members: t.members.filter(m => m !== userId) };
      }
      return t;
    }));
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, team: '' };
      }
      return u;
    }));
    addNotification('Member Removed', `Removed member from team.`);
  };

  const createProject = (name, desc, techStack, repos) => {
    const newProject = {
      id: 'p' + (projects.length + 1),
      name,
      desc,
      techStack,
      repos
    };
    setProjects(prev => [...prev, newProject]);
    addNotification('Project Created', `New project "${name}" created.`);
    return newProject;
  };

  const addTask = (title, desc, teamId, assigneeId) => {
    const newTask = {
      id: 'tsk' + (tasks.length + 1),
      title,
      desc,
      status: 'To Do',
      teamId,
      assigneeId,
      plan: '',
      feedback: ''
    };
    setTasks(prev => [...prev, newTask]);
    addNotification('Task Created', `Created task "${title}".`);
  };

  const planTask = (taskId, planText) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, plan: planText, status: 'In Progress' };
      }
      return t;
    }));
    addNotification('Task Planned', `Saved implementation plan for task.`);
  };

  const updateTaskStatus = (taskId, status) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedTask = { ...t, status };
        if (status === 'In Review') {
          const newWorkflow = {
            id: 'wf' + (workflows.length + 1),
            taskId,
            employeeId: currentUser?.id,
            employeeNotes: `Task completed. Ready for supervisor review. Plan: ${t.plan}`,
            adminNotes: '',
            status: 'Pending',
            timestamp: new Date().toISOString()
          };
          setWorkflows(wfs => [...wfs, newWorkflow]);
          addNotification('Workflow Submitted', `Task "${t.title}" sent for Admin approval.`);
        }
        return updatedTask;
      }
      return t;
    }));
  };

  const approveWorkflow = (wfId, notes) => {
    const wf = workflows.find(w => w.id === wfId);
    if (!wf) return;

    setWorkflows(prev => prev.map(w => {
      if (w.id === wfId) {
        return { ...w, status: 'Approved', adminNotes: notes };
      }
      return w;
    }));

    setTasks(prev => prev.map(t => {
      if (t.id === wf.taskId) {
        return { ...t, status: 'Completed', feedback: notes };
      }
      return t;
    }));

    addNotification('Task Approved', `Task has been marked as Completed.`);
  };

  const rejectWorkflow = (wfId, notes) => {
    const wf = workflows.find(w => w.id === wfId);
    if (!wf) return;

    setWorkflows(prev => prev.map(w => {
      if (w.id === wfId) {
        return { ...w, status: 'Rejected', adminNotes: notes };
      }
      return w;
    }));

    setTasks(prev => prev.map(t => {
      if (t.id === wf.taskId) {
        return { ...t, status: 'In Progress', feedback: notes };
      }
      return t;
    }));

    addNotification('Task Rejected', `Task returned to In Progress with feedback.`);
  };

  const generateAIResponse = (query, contextDoc = '') => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let answer = '';
        const lowercaseQuery = query.toLowerCase();

        if (lowercaseQuery.includes('docker') || lowercaseQuery.includes('container')) {
          answer = `### Nexus AI - Docker environment assistance
To verify your Docker configuration for **Project Phoenix**, execute these diagnostics:
1. Run \`docker ps\` to check active containers.
2. If the db service isn't launching, check port 5432 bindings using \`netstat -ano | findstr 5432\` on Windows.
3. To rebuild clean images without cache, run \`docker-compose build --no-cache && docker-compose up -d\`.

Would you like me to add a setup check task to your workspace?`;
        } else if (lowercaseQuery.includes('ide') || lowercaseQuery.includes('formatter') || lowercaseQuery.includes('settings')) {
          answer = `### Nexus AI - IDE Configuration Support
For modern enterprise formats:
- In **VS Code**: install the "Checkstyle-IDEA" equivalent extension and set the formatting configuration to point to \`eclipse-java-google-style.xml\` in your root folder.
- In **IntelliJ**: go to \`Preferences -> Editor -> Code Style -> Java\`, click the gear icon, click "Import Scheme", select the XML config.

I can auto-track a task called "Configure Formatter in Editor" for you.`;
        } else if (lowercaseQuery.includes('git') || lowercaseQuery.includes('branch') || lowercaseQuery.includes('pull')) {
          answer = `### Nexus AI - Git Workflow Standards
Our team uses a standard Gitflow model:
- Always create feature branches off \`main\` using: \`git checkout -b feature/your-name/feature-desc\`.
- We use pre-commit hooks to lint files. If your hook blocks execution, check for checkstyle warnings or compile bugs.
- Submit a PR to \`main\` and add your team lead for review. At least 1 approval is required to merge.`;
        } else if (contextDoc) {
          answer = `### Nexus AI - Document Analysis
Based on the document **"${contextDoc}"** you selected:
- This file outlines essential instructions for team integrations.
- Key takeaways: you should complete prerequisites within 3 days, avoid pushing keys/credentials to version control, and set local variables.
- Let me know if you want me to explain any specific term in this document (e.g., SOAP endpoints or EAR packages).`;
        } else {
          answer = `### Nexus AI - General Advisor Response
Hello! I am your Nexus AI onboarding assistant.
- I can answer setup queries about **Project Phoenix** or **Project Apollo**.
- I can analyze local codebase files or developer configuration docs.
- I can create custom learning roadmaps and automatically append items directly to your **My Tasks** list.

How can I help you today? Please feel free to ask about Docker, Git, or IDE setups.`;
        }
        resolve(answer);
      }, 1200);
    });
  };

  return (
    <AppContext.Provider value={{
      users,
      teams,
      projects,
      tasks,
      documents,
      workflows,
      currentUser,
      notifications,
      login,
      logout,
      signup,
      toggleDocRead,
      createDocument,
      editDocument,
      improveDocByAI,
      inviteEmployee,
      activatePendingUser,
      createTeam,
      assignMemberToTeam,
      unassignMemberFromTeam,
      createProject,
      addTask,
      planTask,
      updateTaskStatus,
      approveWorkflow,
      rejectWorkflow,
      generateAIResponse,
      addNotification,
      setNotifications
    }}>
      {children}
    </AppContext.Provider>
  );
};
