
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export const ValidationSettings = () => {
  const { toast } = useToast();
  const [allowedFormats, setAllowedFormats] = useState({
    jpeg: true,
    png: true,
    pdf: true,
  });
  
  const [maxFileSize, setMaxFileSize] = useState("50");
  const [validityPeriods, setValidityPeriods] = useState({
    healthCertificate: "3",
    nationalId: "12",
  });
  
  const [aiValidation, setAiValidation] = useState(true);
  
  const handleSaveChanges = () => {
    toast({
      title: "Success",
      description: "Document validation settings saved successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Document Validation Settings</h2>
        <p className="text-muted-foreground">
          Configure document validation rules and requirements.
        </p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Allowed File Formats</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="jpeg" 
                checked={allowedFormats.jpeg}
                onCheckedChange={(checked) => 
                  setAllowedFormats({ ...allowedFormats, jpeg: !!checked })
                }
              />
              <label
                htmlFor="jpeg"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                JPEG / JPG
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="png" 
                checked={allowedFormats.png}
                onCheckedChange={(checked) => 
                  setAllowedFormats({ ...allowedFormats, png: !!checked })
                }
              />
              <label
                htmlFor="png"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                PNG
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="pdf" 
                checked={allowedFormats.pdf}
                onCheckedChange={(checked) => 
                  setAllowedFormats({ ...allowedFormats, pdf: !!checked })
                }
              />
              <label
                htmlFor="pdf"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                PDF
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">File Size Limits</h3>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label htmlFor="max-size" className="text-sm font-medium block mb-2">
                Maximum Upload Size (MB)
              </label>
              <Input
                id="max-size"
                type="number"
                value={maxFileSize}
                onChange={(e) => setMaxFileSize(e.target.value)}
                min="1"
                max="100"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Document Validity Periods</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="health-certificate" className="text-sm font-medium block mb-2">
                Health Certificate Validity (months)
              </label>
              <Input
                id="health-certificate"
                type="number"
                value={validityPeriods.healthCertificate}
                onChange={(e) => 
                  setValidityPeriods({ 
                    ...validityPeriods, 
                    healthCertificate: e.target.value 
                  })
                }
                min="1"
                max="36"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Documents older than this will be rejected
              </p>
            </div>
            
            <div>
              <label htmlFor="national-id" className="text-sm font-medium block mb-2">
                National ID Validity (months)
              </label>
              <Input
                id="national-id"
                type="number"
                value={validityPeriods.nationalId}
                onChange={(e) => 
                  setValidityPeriods({ 
                    ...validityPeriods, 
                    nationalId: e.target.value 
                  })
                }
                min="1"
                max="36"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">AI-based Validation</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable AI validation for documents</p>
              <p className="text-sm text-muted-foreground">
                Automatically validate document authenticity and compliance
              </p>
            </div>
            <Switch
              checked={aiValidation}
              onCheckedChange={setAiValidation}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end mt-6">
        <Button onClick={handleSaveChanges}>Save All Settings</Button>
      </div>
    </div>
  );
};
