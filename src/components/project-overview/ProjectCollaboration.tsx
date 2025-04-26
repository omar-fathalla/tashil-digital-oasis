
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/AuthProvider";
import { format } from "date-fns";
import { MessageSquare, Send, Clock } from "lucide-react";
import { useProjectComments } from "@/hooks/useProjectComments";
import { useProjectActivities } from "@/hooks/useProjectActivities";

interface ProjectCollaborationProps {
  projectId: string;
}

export const ProjectCollaboration = ({ projectId }: ProjectCollaborationProps) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const { comments, isLoading: isLoadingComments, addComment } = useProjectComments(projectId);
  const { activities, isLoading: isLoadingActivities } = useProjectActivities(projectId);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await addComment(newComment);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
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
          {isLoadingComments ? (
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
                    <AvatarFallback>{comment.user_id[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{comment.user_id}</p>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(comment.created_at), "MMM d, h:mm a")}
                      </span>
                    </div>
                    <p className="mt-1 text-muted-foreground">{comment.content}</p>
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
          {isLoadingActivities ? (
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
                      <span className="font-medium">{activity.user_id}</span> {activity.description}
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
