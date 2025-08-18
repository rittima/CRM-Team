// import Project from "../model/Project.js";
// import User from "../model/User.js";

// // Create a new project
// const createProject = async (req, res) => {
//   try {
//     console.log('📝 Creating new project:', req.body);

//     const {
//       projectId,
//       title,
//       description,
//       manager,
//       email,
//       Skill, // Note: Using the form field name
//       tool,  // Note: Using the form field name
//       status,
//       teamMembers
//     } = req.body;

//     // Validate required fields
//     if (!projectId || !title || !manager || !email) {
//       return res.status(400).json({
//         success: false,
//         message: 'Project ID, Title, Manager name, and Manager email are required.'
//       });
//     }

//     // Check if project ID already exists
//     const existingProject = await Project.findOne({ projectId: projectId.toUpperCase() });
//     if (existingProject) {
//       return res.status(400).json({
//         success: false,
//         message: 'A project with this Project ID already exists.'
//       });
//     }

//     // Validate team members limit
//     if (teamMembers && teamMembers.length > 4) {
//       return res.status(400).json({
//         success: false,
//         message: 'Maximum 4 team members are allowed.'
//       });
//     }

//     // Validate team member emails and employee IDs
//     if (teamMembers && teamMembers.length > 0) {
//       for (const member of teamMembers) {
//         if (!member.empId || !member.empEmail) {
//           return res.status(400).json({
//             success: false,
//             message: 'All team members must have both Employee ID and Email.'
//           });
//         }

//         // Check if employee exists in User collection
//         const userExists = await User.findOne({ employeeId: member.empId });
//         if (!userExists) {
//           return res.status(400).json({
//             success: false,
//             message: `Employee with ID ${member.empId} not found in the system.`
//           });
//         }
//       }
//     }

//     // Create project data object
//     const projectData = {
//       projectId: projectId.toUpperCase(),
//       title,
//       description,
//       manager,
//       email: email.toLowerCase(),
//       skills: req.body.skills || "",
//       tools: req.body.tools || "",
//       status: status || 'Pending',
//       teamMembers: teamMembers || [],
//       createdBy: req.user._id, // Set the user who created the project
//       lastUpdatedBy: req.user._id
//     };

//     // Create and save the project
//     const newProject = new Project(projectData);
//     const savedProject = await newProject.save();

//     console.log('✅ Project created successfully:', savedProject.projectId);

//     res.status(201).json({
//       success: true,
//       message: 'Project created successfully!',
//       project: {
//         id: savedProject._id,
//         projectId: savedProject.projectId,
//         title: savedProject.title,
//         manager: savedProject.manager,
//         status: savedProject.status,
//         teamSize: savedProject.teamSize,
//         createdAt: savedProject.createdAt
//       }
//     });

//   } catch (error) {
//     console.error('❌ Error creating project:', error);

//     // Handle mongoose validation errors
//     if (error.name === 'ValidationError') {
//       const validationErrors = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({
//         success: false,
//         message: 'Validation Error',
//         errors: validationErrors
//       });
//     }

//     // Handle duplicate key error
//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: 'A project with this Project ID already exists.'
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: 'Internal server error while creating project.',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

// // Get all projects
// const getAllProjects = async (req, res) => {
//   try {
//     console.log('📋 Fetching all projects');
//     const { status, manager, page = 1, limit = 10 } = req.query;

//     const filter = {};
//     if (status) filter.status = status;
//     if (manager) filter.manager = new RegExp(manager, 'i');

//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     const projects = await Project.find(filter)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(parseInt(limit))
//       .lean();

//     const totalProjects = await Project.countDocuments(filter);
//     const totalPages = Math.ceil(totalProjects / parseInt(limit));

//     console.log(`📊 Found ${projects.length} projects (Page ${page}/${totalPages})`);

//     res.status(200).json({
//       success: true,
//       projects,
//       pagination: {
//         currentPage: parseInt(page),
//         totalPages,
//         totalProjects,
//         hasNextPage: page < totalPages,
//         hasPrevPage: page > 1
//       }
//     });
//   } catch (error) {
//     console.error('❌ Error fetching projects:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error while fetching projects.',
//       error: error.message,
//       stack: error.stack
//     });
//   }
// };

// // Get project by ID
// const getProjectById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log('🔍 Fetching project by ID:', id);

//     const project = await Project.findById(id)
//       .populate('createdBy', 'name email employeeId')
//       .populate('lastUpdatedBy', 'name email employeeId')
//       .lean();

//     if (!project) {
//       return res.status(404).json({
//         success: false,
//         message: 'Project not found.'
//       });
//     }

//     console.log('✅ Project found:', project.projectId);

//     res.status(200).json({
//       success: true,
//       project
//     });
//   } catch (error) {
//     console.error('❌ Error fetching project by ID:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error while fetching project.'
//     });
//   }
// };

// // Update project
// const updateProject = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log('✏️ Updating project:', id);

//     const project = await Project.findByIdAndUpdate(
//       id,
//       { ...req.body, lastUpdatedBy: req.user._id },
//       { new: true }
//     );

//     if (!project) {
//       return res.status(404).json({
//         success: false,
//         message: 'Project not found.'
//       });
//     }

//     console.log('✅ Project updated successfully:', project.projectId);

//     res.status(200).json({
//       success: true,
//       message: 'Project updated successfully!',
//       project
//     });
//   } catch (error) {
//     console.error('❌ Error updating project:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error while updating project.'
//     });
//   }
// };

// // Delete project (soft delete)
// const deleteProject = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log('🗑️ Deleting project:', id);

//     const deletedProject = await Project.findByIdAndUpdate(
//       id,
//       { isActive: false, lastUpdatedBy: req.user._id },
//       { new: true }
//     );

//     if (!deletedProject) {
//       return res.status(404).json({
//         success: false,
//         message: 'Project not found.'
//       });
//     }

//     console.log('✅ Project deleted successfully:', deletedProject.projectId);

//     res.status(200).json({
//       success: true,
//       message: 'Project deleted successfully!'
//     });
//   } catch (error) {
//     console.error('❌ Error deleting project:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error while deleting project.'
//     });
//   }
// };

// // Get project statistics
// const getProjectStats = async (req, res) => {
//   try {
//     console.log('📊 Fetching project statistics');

//     const stats = await Project.getProjectStats();

//     // Calculate total projects
//     const totalProjects = await Project.countDocuments({ isActive: true });

//     // Get projects by priority
//     const priorityStats = await Project.aggregate([
//       { $match: { isActive: true } },
//       {
//         $group: {
//           _id: '$priority',
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     console.log('✅ Project statistics calculated');

//     res.status(200).json({
//       success: true,
//       stats: {
//         total: totalProjects,
//         byStatus: stats,
//         byPriority: priorityStats
//       }
//     });
//   } catch (error) {
//     console.error('❌ Error fetching project statistics:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error while fetching project statistics.'
//     });
//   }
// };

// // Get projects by current user (as manager or team member)
// const getMyProjects = async (req, res) => {
//   try {
//     const userEmail = req.user.email;
//     const userEmpId = req.user.employeeId;
//     console.log('👤 Fetching projects for user:', userEmail);

//     const projects = await Project.find({
//       isActive: true,
//       $or: [
//         { email: userEmail },
//         { 'teamMembers.empEmail': userEmail },
//         { 'teamMembers.empId': userEmpId }
//       ]
//     })
//       .populate('createdBy lastUpdatedBy', 'name email employeeId')
//       .sort({ createdAt: -1 })
//       .lean();

//     console.log(`✅ Found ${projects.length} projects for user`);

//     res.status(200).json({
//       success: true,
//       projects
//     });
//   } catch (error) {
//     console.error('❌ Error fetching user projects:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error while fetching user projects.'
//     });
//   }
// };

// module.exports = {
//   createProject,
//   getAllProjects,
//   getProjectById,
//   updateProject,
//   deleteProject,
//   getProjectStats,
//   getMyProjects
// };



import Project from "../model/Project.js";
import User from "../model/User.js";

// Create a new project
export const createProject = async (req, res) => {
  try {
    console.log('📝 Creating new project:', req.body);

    const {
      projectId,
      title,
      description,
      manager,
      email,
      Skill, // Note: Using the form field name
      tool,  // Note: Using the form field name
      status,
      teamMembers
    } = req.body;

    if (!projectId || !title || !manager || !email) {
      return res.status(400).json({
        success: false,
        message: 'Project ID, Title, Manager name, and Manager email are required.'
      });
    }

    const existingProject = await Project.findOne({ projectId: projectId.toUpperCase() });
    if (existingProject) {
      return res.status(400).json({
        success: false,
        message: 'A project with this Project ID already exists.'
      });
    }

    if (teamMembers && teamMembers.length > 4) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 4 team members are allowed.'
      });
    }

    if (teamMembers && teamMembers.length > 0) {
      for (const member of teamMembers) {
        if (!member.empId || !member.empEmail) {
          return res.status(400).json({
            success: false,
            message: 'All team members must have both Employee ID and Email.'
          });
        }

        const userExists = await User.findOne({ employeeId: member.empId });
        if (!userExists) {
          return res.status(400).json({
            success: false,
            message: `Employee with ID ${member.empId} not found in the system.`
          });
        }
      }
    }

    const projectData = {
      projectId: projectId.toUpperCase(),
      title,
      description,
      manager,
      email: email.toLowerCase(),
      skills: req.body.skills || "",
      tools: req.body.tools || "",
      status: status || 'Pending',
      teamMembers: teamMembers || [],
      createdBy: req.user._id,
      lastUpdatedBy: req.user._id
    };

    const newProject = new Project(projectData);
    const savedProject = await newProject.save();

    console.log('✅ Project created successfully:', savedProject.projectId);

    res.status(201).json({
      success: true,
      message: 'Project created successfully!',
      project: {
        id: savedProject._id,
        projectId: savedProject.projectId,
        title: savedProject.title,
        manager: savedProject.manager,
        status: savedProject.status,
        teamSize: savedProject.teamSize,
        createdAt: savedProject.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Error creating project:', error);

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: validationErrors
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A project with this Project ID already exists.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while creating project.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all projects
export const getAllProjects = async (req, res) => {
  try {
    console.log('📋 Fetching all projects');
    const { status, manager, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (manager) filter.manager = new RegExp(manager, 'i');

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const totalProjects = await Project.countDocuments(filter);
    const totalPages = Math.ceil(totalProjects / parseInt(limit));

    console.log(`📊 Found ${projects.length} projects (Page ${page}/${totalPages})`);

    res.status(200).json({
      success: true,
      projects,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProjects,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('❌ Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching projects.',
      error: error.message,
      stack: error.stack
    });
  }
};

// Get project by ID
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔍 Fetching project by ID:', id);

    const project = await Project.findById(id)
      .populate('createdBy', 'name email employeeId')
      .populate('lastUpdatedBy', 'name email employeeId')
      .lean();

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.'
      });
    }

    console.log('✅ Project found:', project.projectId);

    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    console.error('❌ Error fetching project by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching project.'
    });
  }
};

// Update project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('✏️ Updating project:', id);

    const project = await Project.findByIdAndUpdate(
      id,
      { ...req.body, lastUpdatedBy: req.user._id },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.'
      });
    }

    console.log('✅ Project updated successfully:', project.projectId);

    res.status(200).json({
      success: true,
      message: 'Project updated successfully!',
      project
    });
  } catch (error) {
    console.error('❌ Error updating project:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while updating project.'
    });
  }
};

// Delete project (soft delete)
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ Deleting project:', id);

    const deletedProject = await Project.findByIdAndUpdate(
      id,
      { isActive: false, lastUpdatedBy: req.user._id },
      { new: true }
    );

    if (!deletedProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.'
      });
    }

    console.log('✅ Project deleted successfully:', deletedProject.projectId);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully!'
    });
  } catch (error) {
    console.error('❌ Error deleting project:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting project.'
    });
  }
};

// Get project statistics
export const getProjectStats = async (req, res) => {
  try {
    console.log('📊 Fetching project statistics');

    const stats = await Project.getProjectStats();
    const totalProjects = await Project.countDocuments({ isActive: true });

    const priorityStats = await Project.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    console.log('✅ Project statistics calculated');

    res.status(200).json({
      success: true,
      stats: {
        total: totalProjects,
        byStatus: stats,
        byPriority: priorityStats
      }
    });
  } catch (error) {
    console.error('❌ Error fetching project statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching project statistics.'
    });
  }
};

// Get projects by current user
export const getMyProjects = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const userEmpId = req.user.employeeId;
    console.log('👤 Fetching projects for user:', userEmail);

    const projects = await Project.find({
      isActive: true,
      $or: [
        { email: userEmail },
        { 'teamMembers.empEmail': userEmail },
        { 'teamMembers.empId': userEmpId }
      ]
    })
      .populate('createdBy lastUpdatedBy', 'name email employeeId')
      .sort({ createdAt: -1 })
      .lean();

    console.log(`✅ Found ${projects.length} projects for user`);

    res.status(200).json({
      success: true,
      projects
    });
  } catch (error) {
    console.error('❌ Error fetching user projects:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching user projects.'
    });
  }
};
