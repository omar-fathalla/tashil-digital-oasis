
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Printer, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import RepresentativeIDCard from "./RepresentativeIDCard";
import { generatePDF } from "@/utils/print/pdfGenerator";

const RepresentativePreview = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: representatives, isLoading } = useQuery({
    queryKey: ['representatives'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('representatives')
        .select(`
          *,
          company:company_id (
            company_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const handleNext = () => {
    if (representatives && currentIndex < representatives.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handlePrint = () => {
    window.print();
    toast.success("Print job sent to printer");
  };

  const handleDownload = async () => {
    if (!representatives?.[currentIndex]) return;
    
    const idCardElement = document.querySelector('.id-card') as HTMLElement;
    if (!idCardElement) {
      toast.error("Could not find ID card element");
      return;
    }

    try {
      await generatePDF(
        idCardElement, 
        `representative-id-${representatives[currentIndex].employee_id}.pdf`
      );
      toast.success("ID Card downloaded successfully");
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Failed to download ID card");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!representatives?.length) {
    return <div>No representatives found</div>;
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Representative ID Preview</span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-6">
          <RepresentativeIDCard 
            representative={representatives[currentIndex]}
            company={representatives[currentIndex].company}
          />
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} of {representatives.length}
            </span>
            <Button
              variant="outline"
              onClick={handleNext}
              disabled={currentIndex === representatives.length - 1}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RepresentativePreview;
