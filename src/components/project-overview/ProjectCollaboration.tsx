
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/AuthProvider";
import { format } from "date-fns";
import { MessageSquare, Send, Clock } from "lucide-react";

interface Comment {
  id: string;
  text: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
}

interface ProjectActivity {
  id: string;
  type: 'create' | 'update' | 'comment' | 'archive';
  description: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: string;
}

interface ProjectCollaborationProps {
  projectId: string;
}

const ProjectCollaboration = ({ projectId }: ProjectCollaborationProps) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [activities, setActivities] = useState<ProjectActivity[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - in a real application, this would come from the API
  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      const mockComments: Comment[] = [
        {
          id: "1",
          text: "I've updated the project specifications as requested. Please review when you get a chance.",
          user: { id: "1", name: "Admin", avatar: "/placeholder.svg" },
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "2",
          text: "Thanks for the update. Everything looks good to me!",
          user: { id: "2", name: "Sarah", avatar: "/placeholder.svg" },
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        },
      ];
      
      const mockActivities: ProjectActivity[] = [
        {
          id: "1",
          type: "create",
          description: "Project created",
          user: { id: "1", name: "Admin" },
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "2",
          type: "update",
          description: "Updated project description",
          user: { id: "1", name: "Admin" },
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "3",
          type: "comment",
          description: "Added a comment",
          user: { id: "2", name: "Sarah" },
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
      
      setComments(mockComments);
      setActivities(mockActivities);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [projectId]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      text: newComment,
      user: { 
        id: user?.id || "current-user", 
        name: user?.email?.split("@")[0] || "You"
      },
      createdAt: new Date().toISOString(),
    };
    
    setComments([...comments, comment]);
    
    // Also add to activities
    const activity: ProjectActivity = {
      id: Date.now().toString(),
      type: "comment",
      description: "Added a comment",
      user: { 
        id: user?.id || "current-user", 
        name: user?.email?.split("@")[0] || "You"
      },
      timestamp: new Date().toISOString(),
    };
    
    setActivities([...activities, activity]);
    setNewComment("");
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Project Comments</CardTitle>
          <CardDescription>
            Discuss project details with your team
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <p>Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center p-8 border border-dashed rounded-md">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No comments yet</p>
              <p className="text-sm text-muted-foreground">Be the first to add a comment to this project</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 text-sm">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user.avatar} />
                    <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{comment.user.name}</p>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(comment.createdAt), "MMM d, h:mm a")}
                      </span>
                    </div>
                    <p className="mt-1 text-muted-foreground">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-4 flex gap-2">
            <Textarea 
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="resize-none"
              rows={1}
            />
            <Button 
              size="icon"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Activity Log</CardTitle>
          <CardDescription>
            Recent updates to this project
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <p>Loading activity...</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center p-8 border border-dashed rounded-md">
              <p className="text-muted-foreground">No activity recorded yet</p>
            </div>
          ) : (
            <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-3.5 before:w-px before:bg-muted">
              {activities.map((activity) => (
                <div key={activity.id} className="flex gap-3 relative">
                  <div className="h-7 w-7 rounded-full bg-background border flex items-center justify-center z-10 mt-0.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user.name}</span> {activity.description}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(activity.timestamp), "MMM d, h:mm a")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectCollaboration;
