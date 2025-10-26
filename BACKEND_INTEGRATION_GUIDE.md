# Backend Integration Guide for Kanban Board

## Current Implementation Issues Fixed

### 1. **Hydration Issues**
- ✅ Fixed Next.js hydration mismatch by loading data only on client side
- ✅ Added proper error handling for localStorage operations
- ✅ Implemented `isClient` state to prevent SSR issues

### 2. **Local Storage Limitations**
- ✅ Added comprehensive comments for backend migration
- ✅ Provided API endpoint suggestions
- ✅ Included database schema recommendations

## Backend API Endpoints Needed

### Project Management
```
GET    /api/projects                    - List all projects
POST   /api/projects                    - Create new project
GET    /api/projects/:id                - Get project details
PUT    /api/projects/:id                - Update project
DELETE /api/projects/:id                - Delete project
```

### Kanban Data Management
```
GET    /api/projects/:id/kanban-data           - Get complete kanban data
PUT    /api/projects/:id/kanban-data           - Update complete kanban data
GET    /api/projects/:id/kanban/columns        - Get column titles
PUT    /api/projects/:id/kanban/columns        - Update column titles
```

### Card Management
```
GET    /api/projects/:id/kanban/cards          - Get all cards
POST   /api/projects/:id/kanban/cards          - Create new card
GET    /api/projects/:id/kanban/cards/:cardId  - Get specific card
PUT    /api/projects/:id/kanban/cards/:cardId  - Update card
DELETE /api/projects/:id/kanban/cards/:cardId  - Delete card
```

### Attachment Management
```
POST   /api/projects/:id/kanban/cards/:cardId/attachments     - Upload attachment
GET    /api/projects/:id/kanban/cards/:cardId/attachments     - List attachments
DELETE /api/projects/:id/kanban/cards/:cardId/attachments/:attachmentId - Delete attachment
GET    /api/attachments/:attachmentId/download                - Download attachment
```

## Database Schema Options

### Option 1: Simple JSON Storage
```sql
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  kanban_data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Option 2: Normalized Schema (Recommended)
```sql
-- Projects table
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Kanban columns table
CREATE TABLE kanban_columns (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  column_key VARCHAR(50) NOT NULL, -- 'backlog', 'todo', 'doing', 'done'
  title VARCHAR(255) NOT NULL,
  color VARCHAR(50),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(project_id, column_key)
);

-- Kanban cards table
CREATE TABLE kanban_cards (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  column_key VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority VARCHAR(20) DEFAULT 'Low',
  type VARCHAR(100),
  date DATE,
  deadline DATE,
  comments JSONB DEFAULT '[]',
  links JSONB DEFAULT '[]',
  assignees JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Attachments table
CREATE TABLE kanban_attachments (
  id SERIAL PRIMARY KEY,
  card_id INTEGER REFERENCES kanban_cards(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_size INTEGER NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW()
);
```

## Migration Steps

### 1. Replace Context Functions
Replace the localStorage functions in `ProjectContext.jsx`:

```javascript
// Replace loadProjectData and saveProjectData with:
const loadProjectData = async (projectId) => {
  try {
    const response = await fetch(`/api/projects/${projectId}/kanban-data`);
    if (!response.ok) throw new Error('Failed to load project data');
    return await response.json();
  } catch (error) {
    console.error('Error loading project data:', error);
    return { columnTitles: { ...defaultColumnTitles }, cards: [] };
  }
};

const saveProjectData = async (projectId, data) => {
  try {
    const response = await fetch(`/api/projects/${projectId}/kanban-data`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to save project data');
  } catch (error) {
    console.error('Error saving project data:', error);
  }
};
```

### 2. Update Dashboard Component
Replace the useEffect hooks in `Dashboard.jsx` with API calls:

```javascript
useEffect(() => {
  const loadProjectData = async () => {
    try {
      setLoading(true);
      const data = await loadProjectData(selectedProject);
      setColumnTitles(data.columnTitles || defaultColumnTitles);
      setCards(data.cards || []);
    } catch (error) {
      console.error('Error loading project data:', error);
      setColumnTitles(defaultColumnTitles);
      setCards([]);
    } finally {
      setLoading(false);
    }
  };
  loadProjectData();
}, [selectedProject]);
```

### 3. Update Attachment Handling
Replace the FileReader approach with proper file upload:

```javascript
const handleAddAttachment = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Validation
  if (file.size > 10 * 1024 * 1024) {
    alert("File size must be less than 10MB");
    return;
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('cardId', id);

    const response = await fetch(`/api/projects/${projectId}/kanban/cards/${id}/attachments`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Upload failed');
    const attachment = await response.json();

    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, attachments: [...(c.attachments || []), attachment] }
          : c
      )
    );
  } catch (error) {
    console.error('Error uploading attachment:', error);
    alert('Failed to upload file. Please try again.');
  }
};
```

## Security Considerations

### 1. File Upload Security
- Validate file types on server side
- Scan files for malware
- Implement file size limits
- Use secure file storage (AWS S3, etc.)
- Generate unique filenames to prevent conflicts

### 2. Authentication & Authorization
- Implement user authentication
- Add project-level permissions
- Validate user access to projects
- Add rate limiting for API calls

### 3. Data Validation
- Validate all input data on server side
- Sanitize file names and content
- Implement proper error handling
- Add request logging

## Performance Optimizations

### 1. Caching
- Implement Redis caching for frequently accessed data
- Cache column titles and project metadata
- Use CDN for file attachments

### 2. Database Optimization
- Add proper indexes on frequently queried columns
- Implement pagination for large card lists
- Use database connection pooling

### 3. Real-time Updates
- Consider WebSocket implementation for real-time collaboration
- Implement optimistic updates for better UX
- Add conflict resolution for simultaneous edits

## Testing Strategy

### 1. Unit Tests
- Test all API endpoints
- Test data validation functions
- Test file upload/download functionality

### 2. Integration Tests
- Test complete user workflows
- Test project switching functionality
- Test attachment handling

### 3. Performance Tests
- Load test with multiple users
- Test file upload performance
- Test database query performance

## Deployment Considerations

### 1. Environment Variables
```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
AWS_S3_BUCKET=your-bucket
JWT_SECRET=your-secret
```

### 2. File Storage
- Use cloud storage (AWS S3, Google Cloud Storage)
- Implement proper backup strategies
- Consider CDN for global file delivery

### 3. Monitoring
- Add application monitoring (Sentry, DataDog)
- Monitor database performance
- Track file upload/download metrics
- Set up alerts for errors

This guide provides a complete roadmap for migrating from localStorage to a proper backend implementation while maintaining all current functionality.
