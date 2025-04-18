
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="bg-primary-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h1>
            <p className="text-lg text-gray-600">
              Find answers to common questions about the Tashil Platform
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12 bg-white flex-1">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="border rounded-lg px-4">
                <AccordionTrigger className="text-lg font-medium py-4">What documents are required for employee registration?</AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  <p className="mb-3">
                    For employee registration, you will need to upload the following documents:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Employee's ID or passport copy (front and back)</li>
                    <li>Authorization letter from your company (on company letterhead)</li>
                    <li>Payment receipt for service fees</li>
                    <li>Recent passport-sized photo of the employee (digital format)</li>
                  </ul>
                  <p className="mt-3">
                    All documents should be clear, legible, and in PDF, JPG, or PNG format, with a maximum size of 5MB per file.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border rounded-lg px-4">
                <AccordionTrigger className="text-lg font-medium py-4">How do I upload files to the platform?</AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  <p className="mb-3">
                    To upload files, follow these steps:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Navigate to the relevant form (Company Registration or Request Submission)</li>
                    <li>Proceed to the document upload section</li>
                    <li>Click on "Select File" for each document type</li>
                    <li>Choose the appropriate file from your device</li>
                    <li>Wait for the upload confirmation before proceeding</li>
                  </ol>
                  <p className="mt-3">
                    The platform supports PDF, JPG, and PNG formats with a maximum file size of 5MB. For optimal results, ensure your documents are clearly scanned or photographed with good lighting.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border rounded-lg px-4">
                <AccordionTrigger className="text-lg font-medium py-4">What if my application is rejected?</AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  <p className="mb-3">
                    If your application is rejected:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Check the rejection reason in the Application Status page</li>
                    <li>Review the specific document or information that needs correction</li>
                    <li>Click on the "Re-upload" button next to the rejected request</li>
                    <li>Upload only the corrected document(s) as indicated</li>
                    <li>Submit the corrected application</li>
                  </ol>
                  <p className="mt-3">
                    You will receive a notification once your corrected application is processed. There is no need to resubmit the entire application; you only need to provide the corrected documents.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border rounded-lg px-4">
                <AccordionTrigger className="text-lg font-medium py-4">How long does the application process take?</AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  <p>
                    Standard processing time for applications is 1-3 business days from the submission date. However, this may vary depending on application volume and completeness of submitted documents. You can check the status of your application in real-time through the Application Status page. For urgent requests, please contact our support team.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border rounded-lg px-4">
                <AccordionTrigger className="text-lg font-medium py-4">How do I download the digital ID once approved?</AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  <p className="mb-3">
                    To download an approved digital ID:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Navigate to the Application Status page</li>
                    <li>Find the approved request in your applications list</li>
                    <li>Click on the download icon in the Actions column</li>
                    <li>Choose to download as PDF or save to mobile wallet</li>
                  </ol>
                  <p className="mt-3">
                    Digital IDs contain a secure QR code that can be scanned for verification. The digital ID can be printed or stored on mobile devices. Each ID has a unique validation code to prevent counterfeiting.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border rounded-lg px-4">
                <AccordionTrigger className="text-lg font-medium py-4">Can I save my application and complete it later?</AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  <p>
                    Yes, the platform features a "Temporary Save" function that allows you to save your progress at any point during the application process. To access your saved applications, log into your account and go to the "Drafts" section. Saved applications are stored for up to 30 days, after which they will be automatically deleted. To continue a saved application, simply click on the application and resume from where you left off.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="border rounded-lg px-4">
                <AccordionTrigger className="text-lg font-medium py-4">How secure is my data on the platform?</AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  <p>
                    The Tashil Platform implements enterprise-grade security measures to protect your data. This includes end-to-end encryption for all transmitted data, secure document storage using AES-256 encryption, regular security audits and compliance with international data protection standards. Access to your company's data is strictly controlled through role-based permissions, and all platform activities are logged for audit purposes. We never share your data with third parties without explicit consent.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8" className="border rounded-lg px-4">
                <AccordionTrigger className="text-lg font-medium py-4">What payment methods are accepted for service fees?</AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  <p>
                    The platform accepts various payment methods including credit/debit cards (Visa, Mastercard, American Express), bank transfers, and popular digital payment services. After making a payment through your preferred method, you will receive a receipt that should be uploaded as part of the application process. For companies with high transaction volumes, we also offer monthly invoicing options. Please contact our finance department for corporate billing arrangements.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
