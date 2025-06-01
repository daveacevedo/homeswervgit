import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  WrenchScrewdriverIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const ProjectKanbanView = ({ projects }) => {
  const [columns, setColumns] = useState({
    planning: {
      id: 'planning',
      title: 'Planning',
      items: projects.filter(project => project.status === 'planning')
    },
    scheduled: {
      id: 'scheduled',
      title: 'Scheduled',
      items: projects.filter(project => project.status === 'scheduled')
    },
    in_progress: {
      id: 'in_progress',
      title: 'In Progress',
      items: projects.filter(project => project.status === 'in_progress')
    },
    on_hold: {
      id: 'on_hold',
      title: 'On Hold',
      items: projects.filter(project => project.status === 'on_hold')
    },
    completed: {
      id: 'completed',
      title: 'Completed',
      items: projects.filter(project => project.status === 'completed')
    }
  });

  const onDragEnd = (result) => {
    if (!result.destination) return;
    
    const { source, destination } = result;
    
    if (source.droppableId === destination.droppableId) {
      // Reordering within the same column
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      });
    } else {
      // Moving from one column to another
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      
      // Update the item's status to match the new column
      const updatedItem = {
        ...removed,
        status: destination.droppableId
      };
      
      destItems.splice(destination.index, 0, updatedItem);
      
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      });
      
      // In a real app, you would update the status in the database here
      // updateProjectStatus(removed.id, destination.droppableId);
    }
  };
  
  const getColumnStyle = (columnId) => {
    switch (columnId) {
      case 'planning':
        return 'bg-gray-50';
      case 'scheduled':
        return 'bg-yellow-50';
      case 'in_progress':
        return 'bg-blue-50';
      case 'on_hold':
        return 'bg-orange-50';
      case 'completed':
        return 'bg-green-50';
      default:
        return 'bg-gray-50';
    }
  };
  
  const getColumnHeaderStyle = (columnId) => {
    switch (columnId) {
      case 'planning':
        return 'text-gray-700 border-gray-300';
      case 'scheduled':
        return 'text-yellow-800 border-yellow-300';
      case 'in_progress':
        return 'text-blue-800 border-blue-300';
      case 'on_hold':
        return 'text-orange-800 border-orange-300';
      case 'completed':
        return 'text-green-800 border-green-300';
      default:
        return 'text-gray-700 border-gray-300';
    }
  };
  
  const getColumnIcon = (columnId) => {
    switch (columnId) {
      case 'planning':
        return <CalendarIcon className="h-5 w-5 mr-2" />;
      case 'scheduled':
        return <CalendarIcon className="h-5 w-5 mr-2" />;
      case 'in_progress':
        return <ClockIcon className="h-5 w-5 mr-2" />;
      case 'on_hold':
        return <ExclamationTriangleIcon className="h-5 w-5 mr-2" />;
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 mr-2" />;
      default:
        return null;
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatCurrency = (amount) => {
    if (!amount) return '';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto pb-4 space-x-4">
        {Object.values(columns).map(column => (
          <div key={column.id} className="flex-shrink-0 w-80">
            <div className={`rounded-lg shadow ${getColumnStyle(column.id)}`}>
              <div className={`px-4 py-3 border-b ${getColumnHeaderStyle(column.id)} flex items-center justify-between`}>
                <div className="flex items-center">
                  {getColumnIcon(column.id)}
                  <h3 className="text-sm font-medium">{column.title}</h3>
                </div>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white text-xs font-medium">
                  {column.items.length}
                </span>
              </div>
              
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`p-2 min-h-[500px] ${snapshot.isDraggingOver ? 'bg-opacity-50' : ''}`}
                  >
                    {column.items.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500">
                        <p className="text-sm">No projects</p>
                        <p className="text-xs">Drag projects here</p>
                      </div>
                    ) : (
                      column.items.map((project, index) => (
                        <Draggable key={project.id} draggableId={project.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`mb-2 rounded-lg bg-white shadow-sm border ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                            >
                              <Link to={`/homeowner/projects/${project.id}`} className="block p-3">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0">
                                    <WrenchScrewdriverIcon className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <div className="ml-3 flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {project.title}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="mt-2 text-xs text-gray-500">
                                  {project.description && (
                                    <p className="truncate mb-1">{project.description}</p>
                                  )}
                                  
                                  {project.provider && (
                                    <p className="truncate mb-1">
                                      Provider: {project.provider.name}
                                    </p>
                                  )}
                                  
                                  {project.location && (
                                    <p className="truncate mb-1">
                                      Location: {project.location}
                                    </p>
                                  )}
                                  
                                  {project.budget && (
                                    <p className="truncate mb-1">
                                      Budget: {formatCurrency(project.budget)}
                                    </p>
                                  )}
                                  
                                  {project.status === 'in_progress' && project.progress > 0 && (
                                    <div className="mt-2">
                                      <div className="relative pt-1">
                                        <div className="overflow-hidden h-1 text-xs flex rounded bg-gray-200">
                                          <div
                                            style={{ width: `${project.progress}%` }}
                                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                                          ></div>
                                        </div>
                                        <p className="text-right text-xs mt-1">{project.progress}%</p>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {project.status === 'scheduled' && project.startDate && (
                                    <div className="mt-2 flex items-center">
                                      <CalendarIcon className="h-3 w-3 mr-1" />
                                      <span>Starts: {formatDate(project.startDate)}</span>
                                    </div>
                                  )}
                                  
                                  {project.status === 'on_hold' && project.holdReason && (
                                    <div className="mt-2 flex items-center text-orange-600">
                                      <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                                      <span>{project.holdReason}</span>
                                    </div>
                                  )}
                                  
                                  {project.status === 'completed' && project.completedDate && (
                                    <div className="mt-2 flex items-center text-green-600">
                                      <CheckCircleIcon className="h-3 w-3 mr-1" />
                                      <span>Completed: {formatDate(project.completedDate)}</span>
                                    </div>
                                  )}
                                </div>
                              </Link>
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default ProjectKanbanView;
