// src/pages/Dashboard/Reports.tsx
import React, { useState, useRef } from "react";
import { 
  CheckCircle2, 
  XCircle,
  AlertTriangle,
  Clock,
  FileText,
  ChevronRight,
  Download,
  Printer,
  Share2,
  FileSearch,
  FileCheck,
  Shield,
  Gavel,
  ClipboardList
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from 'react-to-print';
import { saveAs } from 'file-saver';
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';

type Status = 'met' | 'not-met' | 'complete' | 'in-progress' | 'pending';

interface ComplianceCheck {
  id: number;
  category: string;
  requirement: string;
  status: Status;
  evidence: string;
  critical: boolean;
}

interface ChecklistItem {
  id: string;
  title: string;
  status: Status;
  deadline: string;
  assigned: string;
  requirementType: 'format' | 'content' | 'attachment';
  details: string;
}

interface RiskItem {
  id: number;
  category: 'contractual' | 'financial' | 'technical' | 'operational';
  title: string;
  riskLevel: 'high' | 'medium' | 'low';
  description: string;
  mitigation: string;
  clauseReference: string;
}

interface ReportData {
  id: string;
  title: string;
  agency: string;
  date: string;
  submissionDeadline: string;
  compliance: {
    overallStatus: boolean;
    checks: ComplianceCheck[];
  };
  eligibility: {
    proceed: boolean;
    criteria: {
      id: number;
      requirement: string;
      status: Status;
      evidence: string;
      critical: boolean;
    }[];
  };
  checklist: {
    items: ChecklistItem[];
  };
  risks: RiskItem[];
  recommendations: string[];
  automatedChecks: {
    legalEligibility: boolean;
    certifications: string[];
    missingRequirements: string[];
    dealBreakers: string[];
  };
}

const dummyReport: ReportData = {
    id: "RFP-25-008",
    title: "Temporary Staffing Services",
    agency: "MHMR of Tarrant County",
    date: "2025-02-10",
    submissionDeadline: "2025-02-27T14:00:00",
    compliance: {
      overallStatus: true,
      checks: [
        {
          id: 1,
          category: "Legal",
          requirement: "Pre-Proposal Conference Attendance",
          status: "met",
          evidence: "Attendance confirmed on 2025-02-12",
          critical: true
        },
        {
          id: 2,
          category: "Legal",
          requirement: "Non-Collusion Affidavit (Attachment D)",
          status: "complete",
          evidence: "Completed and notarized on 2025-02-15",
          critical: true
        },
        {
          id: 3,
          category: "Legal",
          requirement: "Reference Form (Attachment E)",
          status: "complete",
          evidence: "3 references provided and verified",
          critical: true
        },
        {
          id: 4,
          category: "Legal",
          requirement: "Texas Employment Agency License",
          status: "met",
          evidence: "License TXEA-34892 active",
          critical: true
        },
        {
          id: 5,
          category: "Financial",
          requirement: "CPA Financial Solvency Letter",
          status: "met",
          evidence: "Letter provided by Smith & Associates CPA",
          critical: true
        }
      ]
    },
    eligibility: {
      proceed: true,
      criteria: [
        {
          id: 1,
          requirement: "7+ years temporary staffing experience",
          status: "met",
          evidence: "7 years experience in temp staffing",
          critical: true
        },
        {
          id: 2,
          requirement: "Relevant service offerings",
          status: "met",
          evidence: "Provides Admin, IT, Legal, Credentialing staffing",
          critical: false
        },
        {
          id: 3,
          requirement: "Government references (>2000 employees)",
          status: "met",
          evidence: "3 government references confirmed",
          critical: true
        },
        {
          id: 4,
          requirement: "HUB/DBE certification",
          status: "met",
          evidence: "HUB certification obtained",
          critical: false
        }
      ]
    },
    checklist: {
      items: [
        {
          id: "CL-1",
          title: "Attachment D - Non-Collusion Affidavit",
          status: "complete",
          deadline: "2025-02-27",
          assigned: "Legal",
          requirementType: "attachment",
          details: "Notarized and submitted"
        },
        {
          id: "CL-2",
          title: "Attachment E - Reference Form",
          status: "complete",
          deadline: "2025-02-27",
          assigned: "Sales",
          requirementType: "attachment",
          details: "3 references submitted"
        },
        {
          id: "CL-3",
          title: "Executive Summary",
          status: "complete",
          deadline: "2025-02-25",
          assigned: "Marketing",
          requirementType: "content",
          details: "Submitted, 4 pages demonstrating MHMR needs understanding"
        },
        {
          id: "CL-4",
          title: "Technical Proposal",
          status: "complete",
          deadline: "2025-02-25",
          assigned: "Operations",
          requirementType: "content",
          details: "Submitted with detailed staffing process and capabilities"
        },
        {
          id: "CL-5",
          title: "Insurance Compliance",
          status: "complete",
          deadline: "2025-02-27",
          assigned: "Legal",
          requirementType: "attachment",
          details: "Verified with Travelers Insurance"
        }
      ]
    },
    risks: [
      {
        id: 1,
        category: "contractual",
        title: "Waiver of Subrogation",
        riskLevel: "low",
        description: "Insurance provider has endorsed the waiver",
        mitigation: "Completed - Insurance provider endorsement received",
        clauseReference: "Page 20, Clause 4"
      },
      {
        id: 2,
        category: "financial",
        title: "Contract Terms Review",
        riskLevel: "low",
        description: "All contract terms have been reviewed and accepted",
        mitigation: "Completed - Full RFP document reviewed by legal team",
        clauseReference: "Attachment C"
      },
      {
        id: 3,
        category: "operational",
        title: "Reference Requirements",
        riskLevel: "low",
        description: "3 qualifying government references confirmed",
        mitigation: "Completed - References verified and submitted",
        clauseReference: "Attachment E"
      }
    ],
    recommendations: [
      "Submit complete proposal package by Feb 27 deadline",
      "Follow up with agency contact to confirm receipt",
      "Prepare presentation materials for potential interview",
      "Review scoring criteria to maximize points"
    ],
    automatedChecks: {
      legalEligibility: true,
      certifications: [
        "Texas Employment Agency License",
        "HUB Certification"
      ],
      missingRequirements: [],
      dealBreakers: []
    }
  };

const StatusBadge = ({ status }: { status: Status | 'high' | 'medium' | 'low' }) => {
  const statusConfig = {
    met: { color: "bg-green-100 text-green-800", icon: <CheckCircle2 className="h-4 w-4" /> },
    "not-met": { color: "bg-red-100 text-red-800", icon: <XCircle className="h-4 w-4" /> },
    complete: { color: "bg-green-100 text-green-800", icon: <CheckCircle2 className="h-4 w-4" /> },
    "in-progress": { color: "bg-yellow-100 text-yellow-800", icon: <Clock className="h-4 w-4" /> },
    pending: { color: "bg-gray-100 text-gray-800", icon: <FileText className="h-4 w-4" /> },
    high: { color: "bg-red-100 text-red-800", icon: <AlertTriangle className="h-4 w-4" /> },
    medium: { color: "bg-amber-100 text-amber-800", icon: <AlertTriangle className="h-4 w-4" /> },
    low: { color: "bg-blue-100 text-blue-800", icon: <AlertTriangle className="h-4 w-4" /> }
  };

  const { color, icon } = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {icon}
      {status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
    </span>
  );
};

const AnalysisStep = ({ 
  title, 
  children,
  status,
  icon
}: {
  title: string;
  children: React.ReactNode;
  status?: 'success' | 'warning' | 'error' | 'info';
  icon?: React.ReactNode;
}) => {
  const borderColor = {
    success: 'border-green-200',
    warning: 'border-yellow-200',
    error: 'border-red-200',
    info: 'border-blue-200',
    undefined: 'border-gray-200'
  }[status];

  const iconComponent = icon || (
    status === 'success' ? <CheckCircle2 className="h-5 w-5 text-green-500" /> :
    status === 'warning' ? <AlertTriangle className="h-5 w-5 text-yellow-500" /> :
    status === 'error' ? <XCircle className="h-5 w-5 text-red-500" /> :
    status === 'info' ? <FileSearch className="h-5 w-5 text-blue-500" /> :
    <FileText className="h-5 w-5 text-gray-500" />
  );

  return (
    <div className={`bg-white rounded-lg border ${borderColor} shadow-sm mb-6 overflow-hidden`}>
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          {iconComponent}
          {title}
        </h3>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

const Reports: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Compliance check
  const isCompliant = dummyReport.compliance.overallStatus;
  const nonCompliantItems = dummyReport.compliance.checks.filter(c => c.status === 'not-met' && c.critical);

  // Print functionality
  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    pageStyle: `
      @page { size: auto; margin: 10mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; }
        .no-print { display: none !important; }
        .print-break { page-break-after: always; }
      }
    `,
    onBeforeGetContent: () => {
      document.body.classList.add('printing');
      return Promise.resolve();
    },
    onAfterPrint: () => {
      document.body.classList.remove('printing');
    }
  });
  
  // Create a wrapper function for the print button
  const onPrint = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handlePrint();
  };

  // Export as PDF functionality
  const handleExport = async () => {
    if (!reportRef.current) return;
    
    setIsExporting(true);
    try {
      const dataUrl = await htmlToImage.toPng(reportRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#f9fafb'
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${dummyReport.id}-report.pdf`);
    } catch (error) {
      console.error('Error exporting report:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-6" ref={reportRef}>
          {/* Step 1: Automated Compliance Check */}
          <AnalysisStep 
            title="1. Automated Compliance Verification" 
            status={isCompliant ? 'success' : 'error'}
            icon={<FileCheck className="h-5 w-5" />}
          >
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${
                isCompliant ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-3">
                  {isCompliant ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  )}
                  <div>
                    <h4 className="font-medium">
                      {isCompliant ? 'All mandatory requirements met' : 'Critical compliance issues found'}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {isCompliant ? 
                        'You are eligible to proceed with this RFP submission' : 
                        'Cannot proceed until critical requirements are met'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Deal Breakers Section */}
              {dummyReport.automatedChecks.dealBreakers.length > 0 && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="font-medium flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    Deal Breakers
                  </h4>
                  <ul className="mt-2 space-y-1">
                    {dummyReport.automatedChecks.dealBreakers.map((item, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Compliance Details */}
              <div className="space-y-3">
                <h4 className="font-medium">Detailed Compliance Checks:</h4>
                {dummyReport.compliance.checks.map(check => (
                  <div 
                    key={check.id} 
                    className={`flex items-start gap-3 p-3 rounded-lg ${
                      check.status === 'not-met' && check.critical ? 'bg-red-50' : 
                      check.status === 'not-met' ? 'bg-yellow-50' : 'bg-gray-50'
                    }`}
                  >
                    <StatusBadge status={check.status} />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium">{check.requirement}</p>
                        <span className="text-xs text-gray-500">{check.category}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{check.evidence}</p>
                      {check.critical && (
                        <p className="text-xs text-red-600 mt-1">Mandatory Requirement</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {!isCompliant && (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-medium">Next Steps:</h4>
                  <p className="text-sm mt-2">
                    Resolve the critical compliance issues before proceeding with the RFP analysis.
                  </p>
                  <ul className="mt-2 space-y-1">
                    {nonCompliantItems.map((item, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        {item.requirement}: {item.evidence}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </AnalysisStep>

          {/* Step 2: Eligibility Criteria */}
          <AnalysisStep 
            title="2. Eligibility Criteria Analysis" 
            status={
              dummyReport.eligibility.proceed ? 'success' : 'warning'
            }
            icon={<ClipboardList className="h-5 w-5" />}
          >
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${
                dummyReport.eligibility.proceed ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-center gap-3">
                  {dummyReport.eligibility.proceed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                  )}
                  <div>
                    <h4 className="font-medium">
                      {dummyReport.eligibility.proceed ? 
                        'Meets all eligibility criteria' : 
                        'Some eligibility criteria not met'}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {dummyReport.eligibility.proceed ?
                        'You qualify to submit a proposal' :
                        'Review missing criteria below'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Detailed Eligibility Criteria:</h4>
                {dummyReport.eligibility.criteria.map(criteria => (
                  <div 
                    key={criteria.id} 
                    className={`flex items-start gap-3 p-3 rounded-lg ${
                      criteria.status === 'not-met' && criteria.critical ? 'bg-red-50' : 
                      criteria.status === 'not-met' ? 'bg-yellow-50' : 'bg-gray-50'
                    }`}
                  >
                    <StatusBadge status={criteria.status} />
                    <div className="flex-1">
                      <p className="font-medium">{criteria.requirement}</p>
                      <p className="text-sm text-gray-600 mt-1">{criteria.evidence}</p>
                      {criteria.critical && (
                        <p className="text-xs text-red-600 mt-1">Critical Requirement</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {!dummyReport.eligibility.proceed && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium">Recommendation:</h4>
                  <p className="text-sm mt-2">
                    While not mandatory, meeting these eligibility criteria strengthens your competitive position.
                  </p>
                </div>
              )}
            </div>
          </AnalysisStep>

          {/* Step 3: Submission Requirements */}
          <AnalysisStep 
            title="3. Submission Requirements Analysis" 
            status={
              dummyReport.checklist.items.some(i => i.status === 'pending') ? 'warning' : 'success'
            }
            icon={<FileText className="h-5 w-5" />}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-500">Total Requirements</p>
                  <p className="text-2xl font-semibold">{dummyReport.checklist.items.length}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-2xl font-semibold">
                    {dummyReport.checklist.items.filter(i => i.status === 'complete').length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-semibold">
                    {dummyReport.checklist.items.filter(i => i.status !== 'complete').length}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requirement</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deadline</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {dummyReport.checklist.items.map(item => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.title}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {item.requirementType}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {item.details}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {new Date(item.deadline).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium">Submission Deadline:</h4>
                <p className="text-lg font-semibold mt-1">
                  {new Date(dummyReport.submissionDeadline).toLocaleDateString()} at 5:00 PM EST
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Late submissions will not be considered
                </p>
              </div>
            </div>
          </AnalysisStep>

          {/* Step 4: Risk Analysis */}
          <AnalysisStep 
            title="4. Contract Risk Assessment" 
            status={
              dummyReport.risks.some(r => r.riskLevel === 'high') ? 'warning' : 'success'
            }
            icon={<Shield className="h-5 w-5" />}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-500">Total Risks Identified</p>
                  <p className="text-2xl font-semibold">{dummyReport.risks.length}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-gray-500">High Risks</p>
                  <p className="text-2xl font-semibold">
                    {dummyReport.risks.filter(r => r.riskLevel === 'high').length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-gray-500">Medium Risks</p>
                  <p className="text-2xl font-semibold">
                    {dummyReport.risks.filter(r => r.riskLevel === 'medium').length}
                  </p>
                </div>
              </div>

              {dummyReport.risks.map(risk => (
                <div 
                  key={risk.id} 
                  className={`p-4 rounded-lg border ${
                    risk.riskLevel === 'high' ? 'bg-red-50 border-red-200' : 
                    risk.riskLevel === 'medium' ? 'bg-yellow-50 border-yellow-200' : 
                    'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <StatusBadge status={risk.riskLevel} />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{risk.title}</h4>
                        <span className="text-xs text-gray-500">{risk.category}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{risk.description}</p>
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <h5 className="text-sm font-medium">Clause Reference:</h5>
                          <p className="text-sm text-gray-600">{risk.clauseReference}</p>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium">Mitigation Strategy:</h5>
                          <p className="text-sm text-gray-600">{risk.mitigation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium">Legal Review Recommendations:</h4>
                <ul className="mt-2 space-y-2">
                  {dummyReport.risks
                    .filter(r => r.riskLevel === 'high')
                    .map((risk, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        {risk.mitigation}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </AnalysisStep>

          {/* Step 5: Final Recommendation */}
          <AnalysisStep 
            title="5. Final Recommendation & Next Steps" 
            status="info"
            icon={<Gavel className="h-5 w-5" />}
          >
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium">Submission Decision:</h4>
                <p className={`text-lg font-semibold mt-1 ${
                  dummyReport.eligibility.proceed ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {dummyReport.eligibility.proceed ? 
                    '✅ RECOMMENDED: Proceed with Submission' : 
                    '⚠️ CONDITIONAL: Proceed with Caution'}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {dummyReport.eligibility.proceed ?
                    'This opportunity aligns well with our capabilities and competitive strengths' :
                    'Proceed only if the missing eligibility criteria can be addressed'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium">Strengths to Highlight:</h4>
                  <ul className="mt-2 space-y-2">
                    {dummyReport.compliance.checks
                      .filter(c => c.status === 'met' && c.critical)
                      .map((check, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {check.requirement}: {check.evidence}
                        </li>
                      ))}
                  </ul>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-medium">Areas Requiring Attention:</h4>
                  <ul className="mt-2 space-y-2">
                    {dummyReport.eligibility.criteria
                      .filter(c => c.status === 'not-met')
                      .map((criteria, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          {criteria.requirement}: {criteria.evidence}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <h4 className="font-medium">Action Plan:</h4>
                <ol className="mt-2 space-y-3 list-decimal list-inside">
                  {dummyReport.recommendations.map((rec, i) => (
                    <li key={i} className="text-sm pl-2">{rec}</li>
                  ))}
                  <li className="text-sm pl-2">
                    Submit complete proposal package by {new Date(dummyReport.submissionDeadline).toLocaleDateString()}
                  </li>
                </ol>
              </div>

              <div className="flex justify-end gap-3 pt-4 no-print">
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={handleExport}
                  disabled={isExporting}
                >
                  <Download className="h-4 w-4" />
                  {isExporting ? 'Exporting...' : 'Export Report'}
                </Button>
                <Button 
  variant="outline" 
  className="gap-2"
  onClick={onPrint}  // Use the wrapper function here
>
  <Printer className="h-4 w-4" />
  Print
</Button>
                <Button className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share with Team
                </Button>
              </div>
            </div>
          </AnalysisStep>
        </main>
      </div>
    </div>
  );
};

export default Reports;