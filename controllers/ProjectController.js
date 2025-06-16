import Project from "../models/Projects.js";


// @desc Create a new project
export const createProject = async (req, res) => {
  try {
    const { title, theme, thumbnail} = req.body;
   
    const newProject = await Project.create({
      userId:req.userId,
      title,
      theme,
      thumbnail,
    });
    
    
   res.status(201).json({
  message: "Project created successfully",
  project: newProject,
});

  } catch (error) {
    res.status(500).json({ error: "Failed to create project" });
  }
};


// @desc Get all projects for the logged-in user
export const getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
      message: "Projects fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching user projects:", error);
    res.status(500).json({ success: false, message: "Failed to fetch projects" });
  }
};

// @desc Get a single project by ID
export const getSingleProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.userId, // Only fetch if it belongs to current user
    });

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.status(200).json({ success: true, project });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ success: false, message: "Failed to fetch project" });
  }
};

// @desc Delete a project by ID
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found or unauthorized" });
    }

    res.status(200).json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ success: false, message: "Failed to delete project" });
  }
};

// @desc Update a project (title, theme, thumbnail, config)
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProject = await Project.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { $set: req.body }, // Can include title, theme, thumbnail, config
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.status(200).json({ success: true, message: "Project updated", project: updatedProject });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: "Failed to update project" });
  }
};

