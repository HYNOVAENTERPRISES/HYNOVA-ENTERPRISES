import React, { useState } from 'react';
import { 
  Wrench, 
  Award, 
  Briefcase, 
  GraduationCap, 
  Coins, 
  Star, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Upload, 
  FileText, 
  ShieldCheck, 
  AlertCircle, 
  ChevronRight, 
  Play, 
  BookOpen, 
  UserCheck, 
  ArrowRight,
  Search,
  Sparkles,
  Phone,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { TechnicianProfile, JobListing, AcademyCourse, TechnicianRank } from '../types';
import { INITIAL_TECHNICIANS, INITIAL_JOBS, ACADEMY_COURSES, KENYAN_COUNTIES } from '../data/mockData';

export const TechnicianPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'jobs' | 'academy' | 'ranking' | 'register' | 'support'>(
    INITIAL_TECHNICIANS.length > 0 ? 'dashboard' : 'register'
  );
  const [technician, setTechnician] = useState<TechnicianProfile | null>(INITIAL_TECHNICIANS[0] || null);
  const [jobs, setJobs] = useState<JobListing[]>(INITIAL_JOBS);
  const [courses, setCourses] = useState<AcademyCourse[]>(ACADEMY_COURSES);

  // Job Application & Completion state
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [jobEvidenceUploaded, setJobEvidenceUploaded] = useState(false);
  const [customerSignedOff, setCustomerSignedOff] = useState(false);
  const [paymentReleased, setPaymentReleased] = useState(false);

  // Academy Lesson Modal state
  const [selectedCourse, setSelectedCourse] = useState<AcademyCourse | null>(null);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [generatedCert, setGeneratedCert] = useState<string | null>(null);
  const [upgradeInfoModal, setUpgradeInfoModal] = useState<{ rank: string; criteria: string; unlocked: string } | null>(null);

  // Registration Form State
  const [regStep, setRegStep] = useState(1);
  const [regForm, setRegForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    county: 'Nairobi',
    subCounty: 'Westlands',
    disciplines: ['Solar Energy', 'Smart Security'],
    experienceYears: '4',
    nationalId: '',
    policeClearanceNumber: '',
    epraLicense: '',
    portfolioNotes: '',
    referenceName: '',
    referencePhone: '',
  });
  const [regSubmitted, setRegSubmitted] = useState(false);

  // Handle job acceptance
  const handleAcceptJob = (jobId: string) => {
    setJobs(jobs.map(j => j.id === jobId ? { ...j, status: 'In Progress' } : j));
    const target = jobs.find(j => j.id === jobId);
    if (target) {
      setSelectedJob({ ...target, status: 'In Progress' });
    }
  };

  // Handle job completion and escrow payout release
  const handleCompleteMilestone = () => {
    if (!selectedJob) return;
    setJobEvidenceUploaded(true);
    setCustomerSignedOff(true);
    setPaymentReleased(true);
    setJobs(jobs.map(j => j.id === selectedJob.id ? { ...j, status: 'Completed', escrowStatus: 'Released' } : j));
    setTechnician(prev => prev ? ({
      ...prev,
      completedJobs: prev.completedJobs + 1,
      totalEarningsKES: prev.totalEarningsKES + selectedJob.budgetKES,
      earningsThisMonthKES: prev.earningsThisMonthKES + selectedJob.budgetKES,
    }) : null);
  };

  return (
    <div className="py-10 bg-[#FFFFFF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header & Role Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#EEECEC] mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-2.5 py-0.5 rounded-full">
                Certified Technician Hub
              </span>
              <span className="text-xs font-semibold text-[#5C4D50] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#C01E25]" />
                {technician ? `${technician.county} (${technician.subCounty})` : 'Registry Pending Enrollment'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B1C] mt-1">
              Technician Command Center
            </h1>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3">
            <div className="bg-[#EEECEC]/50 px-3.5 py-2 rounded-xl border border-[#EEECEC] text-right">
              <span className="text-[10px] text-[#5C4D50] uppercase font-bold block">Available Balance</span>
              <span className="text-base font-black text-[#C01E25]">
                KES {(technician?.earningsThisMonthKES || 0).toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => setActiveTab('register')}
              className="bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              New Technician Apply
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-4 mb-8 border-b border-[#EEECEC] scrollbar-none">
          {[
            { id: 'dashboard', label: 'My Dashboard', icon: Wrench },
            { id: 'jobs', label: 'Job Board (Escrow Funded)', icon: Briefcase },
            { id: 'academy', label: 'Certification Academy', icon: GraduationCap },
            { id: 'ranking', label: 'Ranking & Badges', icon: Award },
            { id: 'register', label: 'Onboarding & Verification', icon: UserCheck },
            { id: 'support', label: 'Field Support & Codes', icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tech-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#C01E25] text-[#FFFFFF] shadow-sm shadow-[#C01E25]/20'
                    : 'bg-[#EEECEC]/60 text-[#5C4D50] hover:text-[#1E1B1C] hover:bg-[#EEECEC]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          !technician ? (
            <div className="bg-[#FFFFFF] p-8 sm:p-12 rounded-3xl border border-[#EEECEC] text-center max-w-2xl mx-auto space-y-5 my-8">
              <div className="w-16 h-16 rounded-2xl bg-[#F0C9CB]/40 text-[#C01E25] flex items-center justify-center mx-auto">
                <Wrench className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-3 py-1 rounded-full">
                  Registry Status: 0 Enrolled Technicians
                </span>
                <h2 className="text-2xl font-black text-[#1E1B1C] mt-3">
                  No Active Technician Profile Assigned
                </h2>
                <p className="text-xs sm:text-sm text-[#5C4D50] mt-2 max-w-md mx-auto leading-relaxed">
                  In accordance with the strict HYNOVA source-of-truth registry, there are currently 0 active technician records in the Technicians worksheet. Are you an EPRA or NCA certified engineer or installer? Submit your credentials to join our verified national network.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
                <div className="p-4 rounded-2xl bg-[#EEECEC]/40 border border-[#EEECEC]">
                  <span className="text-[10px] font-bold text-[#5C4D50] uppercase block">Total Technicians</span>
                  <span className="text-xl font-black text-[#1E1B1C]">0</span>
                  <span className="text-[10px] text-[#8F7B7F] block">Spreadsheet Records</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#EEECEC]/40 border border-[#EEECEC]">
                  <span className="text-[10px] font-bold text-[#5C4D50] uppercase block">Active / Available</span>
                  <span className="text-xl font-black text-[#1E1B1C]">0 / 0</span>
                  <span className="text-[10px] text-[#8F7B7F] block">Status: Awaiting Signup</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#EEECEC]/40 border border-[#EEECEC]">
                  <span className="text-[10px] font-bold text-[#5C4D50] uppercase block">47 Counties</span>
                  <span className="text-xl font-black text-[#C01E25]">Open for Enlistment</span>
                  <span className="text-[10px] text-[#8F7B7F] block">EPRA / NCA Vetting</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className="px-6 py-3.5 rounded-xl bg-[#C01E25] hover:bg-[#a1181e] text-white font-extrabold text-xs shadow-md shadow-[#C01E25]/20 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>Submit Technician Onboarding Application</span>
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Profile Overview Card */}
              <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#DB7D81]/40 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <img
                  src={technician.avatar}
                  alt={technician.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-[#C01E25] shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E1B1C]">{technician.name}</h2>
                    <span className="text-xs font-bold text-[#C01E25] bg-[#F0C9CB]/40 px-2 py-0.5 rounded-full">
                      {technician.rank}
                    </span>
                  </div>

                  <p className="text-xs text-[#5C4D50] mt-0.5">
                    {technician.subCounty} • Rate: KES {technician.hourlyRateKES.toLocaleString()}/hr
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[#1E1B1C]">
                    <div className="flex items-center gap-1 font-bold text-[#C01E25]">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{technician.rating} / 5.0</span>
                      <span className="text-[#8F7B7F] font-normal">({technician.reviewCount} reviews)</span>
                    </div>
                    <span>•</span>
                    <span className="font-semibold">{technician.completedJobs} Installations Completed</span>
                    <span>•</span>
                    <span className="text-[#C01E25] font-bold">100% Escrow On-Time SLA</span>
                  </div>
                </div>
              </div>

              {/* Verified Badges */}
              <div className="flex flex-wrap md:flex-col gap-2">
                {technician.verifiedBadges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C01E25] bg-[#F0C9CB]/40 px-2.5 py-1 rounded-lg"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{badge}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Financial & Job Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#EEECEC] shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-[#5C4D50] mb-1">
                  Earnings This Month
                </div>
                <div className="text-2xl font-black text-[#C01E25]">
                  KES {technician.earningsThisMonthKES.toLocaleString()}
                </div>
                <div className="text-[11px] text-[#5C4D50] mt-1">Paid directly via M-Pesa B2C</div>
              </div>

              <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#EEECEC] shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-[#5C4D50] mb-1">
                  Lifetime Payouts
                </div>
                <div className="text-2xl font-black text-[#1E1B1C]">
                  KES {technician.totalEarningsKES.toLocaleString()}
                </div>
                <div className="text-[11px] text-[#5C4D50] mt-1">Zero commission deductions</div>
              </div>

              <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#EEECEC] shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-[#5C4D50] mb-1">
                  Acceptance Rate
                </div>
                <div className="text-2xl font-black text-[#1E1B1C]">
                  {technician.acceptanceRate}
                </div>
                <div className="text-[11px] text-[#C01E25] font-semibold mt-1">Top 5% in {technician.county}</div>
              </div>

              <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#EEECEC] shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-[#5C4D50] mb-1">
                  Certification Status
                </div>
                <div className="text-2xl font-black text-[#C01E25]">
                  Level 3
                </div>
                <div className="text-[11px] text-[#5C4D50] mt-1">Eligible for Master Rank</div>
              </div>
            </div>

            {/* Active Bookings / Current Assignments */}
            <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#EEECEC] shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#1E1B1C]">My Active Projects & Dispatches</h3>
                  <p className="text-xs text-[#5C4D50]">Installations assigned to you with funds locked in escrow.</p>
                </div>
                <button
                  onClick={() => setActiveTab('jobs')}
                  className="text-xs font-bold text-[#C01E25] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Browse Available Jobs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {jobs.filter(j => j.status === 'In Progress').map((job) => (
                  <div
                    key={job.id}
                    className="p-4 rounded-2xl bg-[#EEECEC]/30 border border-[#DB7D81]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-2 py-0.5 rounded">
                          {job.category}
                        </span>
                        <span className="text-xs font-bold text-[#1E1B1C]">{job.title}</span>
                      </div>
                      <p className="text-xs text-[#5C4D50] mt-1">
                        Client: {job.clientName} • Location: {job.locationDetails} • Duration: {job.durationDays} days
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-[#C01E25]">
                          KES {job.budgetKES.toLocaleString()}
                        </span>
                        <div className="text-[10px] text-[#DB7D81] font-semibold">{job.escrowStatus}</div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedJob(job);
                          setActiveTab('jobs');
                        }}
                        className="bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] text-xs font-bold px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                      >
                        Manage Milestone
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      )}

        {/* TAB 2: JOB BOARD (ESCROW FUNDED) */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-[#1E1B1C]">Kenyan Project Job Board</h2>
                <p className="text-xs text-[#5C4D50]">
                  Every job is 100% pre-funded into M-Pesa Escrow. Funds are released instantly upon customer testing sign-off.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-[#5C4D50]">
                <span>Filter:</span>
                <span className="bg-[#EEECEC] px-2.5 py-1 rounded-lg text-[#1E1B1C]">All Counties</span>
                <span className="bg-[#F0C9CB]/40 px-2.5 py-1 rounded-lg text-[#C01E25] font-bold">Escrow Funded Only</span>
              </div>
            </div>

            {/* Job Modal / Milestone Management Drawer if selected */}
            {selectedJob && (
              <div className="bg-gradient-to-br from-[#FFFFFF] to-[#EEECEC]/40 border-2 border-[#C01E25] rounded-3xl p-6 sm:p-8 shadow-md">
                <div className="flex items-center justify-between pb-4 border-b border-[#EEECEC] mb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-2.5 py-1 rounded-full">
                      Active Job Milestone Workflow
                    </span>
                    <h3 className="text-xl font-extrabold text-[#1E1B1C] mt-1">{selectedJob.title}</h3>
                    <p className="text-xs text-[#5C4D50]">{selectedJob.clientName} • {selectedJob.locationDetails}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-[#5C4D50]">Payout Amount</span>
                    <div className="text-2xl font-black text-[#C01E25]">
                      KES {selectedJob.budgetKES.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-[#DB7D81] font-bold">{selectedJob.escrowStatus}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#EEECEC]">
                    <div className="text-xs font-bold text-[#1E1B1C] mb-2 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#F0C9CB] text-[#C01E25] flex items-center justify-center text-[10px]">1</span>
                      <span>On-Site Evidence Upload</span>
                    </div>
                    <p className="text-xs text-[#5C4D50] mb-3">Upload geotagged photos of installed inverter wiring or camera alignment.</p>
                    <button
                      onClick={() => setJobEvidenceUploaded(true)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 cursor-pointer ${
                        jobEvidenceUploaded
                          ? 'bg-[#F0C9CB]/40 text-[#C01E25] border-[#C01E25]'
                          : 'bg-[#EEECEC] text-[#1E1B1C] border-[#EEECEC] hover:bg-[#EEECEC]/80'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{jobEvidenceUploaded ? 'Evidence Attached (3 Photos)' : 'Upload Site Photos'}</span>
                    </button>
                  </div>

                  <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#EEECEC]">
                    <div className="text-xs font-bold text-[#1E1B1C] mb-2 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#F0C9CB] text-[#C01E25] flex items-center justify-center text-[10px]">2</span>
                      <span>Customer Digital Sign-Off</span>
                    </div>
                    <p className="text-xs text-[#5C4D50] mb-3">Customer conducts live test and signs digital completion certificate on phone.</p>
                    <button
                      onClick={() => setCustomerSignedOff(true)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 cursor-pointer ${
                        customerSignedOff
                          ? 'bg-[#F0C9CB]/40 text-[#C01E25] border-[#C01E25]'
                          : 'bg-[#EEECEC] text-[#1E1B1C] border-[#EEECEC] hover:bg-[#EEECEC]/80'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{customerSignedOff ? 'Signed by Client (PIN Verified)' : 'Request Customer Sign-Off'}</span>
                    </button>
                  </div>

                  <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#EEECEC]">
                    <div className="text-xs font-bold text-[#1E1B1C] mb-2 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#F0C9CB] text-[#C01E25] flex items-center justify-center text-[10px]">3</span>
                      <span>Escrow M-Pesa Release</span>
                    </div>
                    <p className="text-xs text-[#5C4D50] mb-3">Instant funds transfer to your registered Safaricom M-Pesa number.</p>
                    <button
                      onClick={handleCompleteMilestone}
                      disabled={paymentReleased}
                      className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-[#C01E25] hover:bg-[#a1181e] disabled:opacity-60 text-[#FFFFFF] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>{paymentReleased ? 'KES Released to M-Pesa' : 'Complete & Release Payout'}</span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="text-xs font-bold text-[#5C4D50] hover:text-[#1E1B1C] px-3 py-1 cursor-pointer"
                  >
                    Close Job Inspector
                  </button>
                </div>
              </div>
            )}

            {/* List of Available Jobs */}
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#EEECEC] hover:border-[#DB7D81]/70 transition-all shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-[#C01E25] bg-[#F0C9CB]/40 px-2.5 py-0.5 rounded">
                        {job.category}
                      </span>
                      <span className="text-xs text-[#5C4D50] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#C01E25]" />
                        {job.locationDetails}
                      </span>
                      {job.distanceKmFromTech !== undefined && (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{job.distanceKmFromTech} km ({job.estimatedTravelTimeMinutes}m drive)</span>
                        </span>
                      )}
                      <span className="text-xs text-[#DB7D81]">• {job.datePosted}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#1E1B1C]">{job.title}</h3>
                    <p className="text-xs text-[#5C4D50] leading-relaxed">{job.description}</p>

                    {/* Installation Recipient Notice if for another person */}
                    {job.isDifferentInstallationLocation && job.recipientContact && (
                      <div className="p-2.5 bg-[#EEECEC]/40 rounded-xl border border-[#EEECEC] text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-[#1E1B1C]">
                          <UserCheck className="w-3.5 h-3.5 text-[#C01E25]" />
                          <span>On-Site Contact (Installation for Another Person):</span>
                          <span className="text-[#C01E25]">{job.recipientContact.recipientName}</span>
                          {job.recipientContact.recipientPhone && (
                            <a href={`tel:${job.recipientContact.recipientPhone}`} className="text-emerald-700 font-extrabold hover:underline ml-1">
                              ({job.recipientContact.recipientPhone})
                            </a>
                          )}
                        </div>
                        {job.recipientContact.siteAccessInstructions && (
                          <p className="text-[11px] text-[#5C4D50]">
                            Access note: {job.recipientContact.siteAccessInstructions}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {job.scopeItems.map((s, idx) => (
                        <span key={idx} className="text-[10px] bg-[#EEECEC] text-[#1E1B1C] px-2 py-0.5 rounded font-medium">
                          ✓ {s}
                        </span>
                      ))}

                      {job.googleMapsUrl && (
                        <a
                          href={job.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-[#C01E25] hover:text-[#a1181e] flex items-center gap-1 ml-auto bg-[#F0C9CB]/30 px-2.5 py-1 rounded-lg border border-[#DB7D81]/30"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>Navigate in Google Maps</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-[#EEECEC]">
                    <div className="text-left md:text-right">
                      <div className="text-xl font-black text-[#C01E25]">
                        KES {job.budgetKES.toLocaleString()}
                      </div>
                      <div className="text-[11px] font-bold text-[#5C4D50]">{job.escrowStatus}</div>
                      <div className="text-[10px] text-[#DB7D81]">Requires {job.requiredRank}</div>
                    </div>

                    {job.status === 'Open' ? (
                      <button
                        onClick={() => handleAcceptJob(job.id)}
                        className="bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        Accept Assignment
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="bg-[#EEECEC] hover:bg-[#F0C9CB]/40 text-[#C01E25] text-xs font-bold px-4 py-2.5 rounded-xl border border-[#DB7D81]/40 transition-colors cursor-pointer"
                      >
                        View Active Milestone
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ACADEMY & CERTIFICATES */}
        {activeTab === 'academy' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-[#1E1B1C]">Technician Certification Academy</h2>
                <p className="text-xs text-[#5C4D50]">
                  Earn recognized digital credentials in Solar PV, Edge AI CCTV, Optical Fiber, and Smart BMS.
                </p>
              </div>

              <div className="text-xs font-bold text-[#C01E25] bg-[#F0C9CB]/40 px-3 py-1.5 rounded-xl">
                2 of 4 Certifications Completed
              </div>
            </div>

            {/* Course Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#EEECEC] hover:border-[#DB7D81] transition-all flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold text-[#C01E25] bg-[#F0C9CB]/40 px-2.5 py-0.5 rounded">
                        {course.category}
                      </span>
                      <span className="text-xs font-semibold text-[#5C4D50]">
                        {course.durationHours} Hours • {course.modulesCount} Modules
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#1E1B1C] mb-2">{course.title}</h3>
                    <p className="text-xs text-[#5C4D50] leading-relaxed mb-4">{course.description}</p>

                    <div className="mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F7B7F] block mb-1">
                        Skills Verified
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {course.skillsGained.map((sk, idx) => (
                          <span key={idx} className="text-[10px] bg-[#EEECEC] text-[#1E1B1C] px-2 py-0.5 rounded">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#EEECEC] flex items-center justify-between">
                    {course.completed ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#C01E25]" />
                        <span className="text-xs font-bold text-[#C01E25]">Certified ({course.score}%)</span>
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-[#5C4D50]">In Progress (Module 3/7)</span>
                    )}

                    <button
                      onClick={() => {
                        setSelectedCourse(course);
                        setQuizScore(null);
                        setGeneratedCert(null);
                      }}
                      className="bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      {course.completed ? 'View Digital Certificate' : 'Resume Lesson & Quiz'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Lesson & Certificate Modal Simulator */}
            {selectedCourse && (
              <div className="bg-gradient-to-br from-[#FFFFFF] to-[#EEECEC]/50 border-2 border-[#C01E25] rounded-3xl p-6 sm:p-8 shadow-lg">
                <div className="flex items-center justify-between pb-4 border-b border-[#EEECEC] mb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#C01E25]">
                      HYNOVA Academy Examination & Credential Center
                    </span>
                    <h3 className="text-xl font-bold text-[#1E1B1C] mt-0.5">{selectedCourse.title}</h3>
                    <p className="text-xs text-[#5C4D50]">Lead Instructor: {selectedCourse.instructor}</p>
                  </div>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="text-xs font-bold text-[#5C4D50] hover:text-[#1E1B1C]"
                  >
                    Close Exam
                  </button>
                </div>

                {!generatedCert ? (
                  <div className="space-y-4">
                    <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#EEECEC]">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#C01E25] mb-2">
                        <Play className="w-4 h-4" />
                        <span>Interactive Video Lesson Simulation: Commissioning Protocol & Safety</span>
                      </div>
                      <p className="text-xs text-[#5C4D50] leading-relaxed">
                        Watch the EPRA safety guidelines on dual MPPT DC isolator locking before proceeding to the knowledge assessment below.
                      </p>
                    </div>

                    <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#EEECEC] space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E1B1C]">
                        Certification Assessment Question:
                      </h4>
                      <p className="text-xs text-[#1E1B1C] font-semibold">
                        When connecting an 8kW Deye hybrid inverter to a lithium battery pack over CAN bus, which pin combination is the standard high/low differential pair?
                      </p>

                      <div className="space-y-2 text-xs">
                        {[
                          { id: 0, text: 'Pin 4 (CAN High) and Pin 5 (CAN Low)' },
                          { id: 1, text: 'Pin 1 (CAN High) and Pin 2 (CAN Low)' },
                          { id: 2, text: 'Pin 7 (Ground) and Pin 8 (12V VCC)' },
                        ].map((opt) => (
                          <label
                            key={opt.id}
                            className="flex items-center gap-2 p-2.5 rounded-xl border border-[#EEECEC] hover:bg-[#EEECEC]/50 cursor-pointer text-[#1E1B1C]"
                          >
                            <input
                              type="radio"
                              name="assessment-q1"
                              checked={userAnswers[0] === opt.id}
                              onChange={() => setUserAnswers({ ...userAnswers, 0: opt.id })}
                              className="accent-[#C01E25]"
                            />
                            <span>{opt.text}</span>
                          </label>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          const passed = userAnswers[0] === 0;
                          setQuizScore(passed ? 100 : 60);
                          if (passed) {
                            setGeneratedCert(`HYNOVA-CERT-${Math.floor(100000 + Math.random() * 900000)}-2026`);
                          }
                        }}
                        className="bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                      >
                        Submit Assessment
                      </button>

                      {quizScore !== null && (
                        <div className={`p-3 rounded-xl text-xs font-bold ${
                          quizScore >= 80 ? 'bg-[#F0C9CB]/50 text-[#C01E25]' : 'bg-[#EEECEC] text-[#5C4D50]'
                        }`}>
                          Score: {quizScore}% — {quizScore >= 80 ? 'Passed! Generating Digital Certificate...' : 'Review module and retry.'}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Digital Certificate Display */
                  <div className="bg-[#FFFFFF] p-8 rounded-3xl border-4 border-[#C01E25] text-center shadow-lg space-y-4 max-w-2xl mx-auto">
                    <div className="w-12 h-12 rounded-2xl bg-[#C01E25] text-[#FFFFFF] flex items-center justify-center mx-auto">
                      <Award className="w-6 h-6" />
                    </div>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-[#DB7D81]">
                      HYNOVA ENTERPRISES ACADEMY • REPUBLIC OF KENYA
                    </div>
                    <h3 className="text-2xl font-black text-[#1E1B1C]">
                      Digital Certificate of Technical Competence
                    </h3>
                    <p className="text-xs text-[#5C4D50]">This verifiable digital credential certifies that</p>
                    <div className="text-xl font-extrabold text-[#C01E25] underline decoration-[#DB7D81]">
                      {technician ? technician.name : (regForm.fullName || 'Certified Technician Candidate')}
                    </div>
                    <p className="text-xs text-[#5C4D50]">
                      has successfully demonstrated mastery of <strong>{selectedCourse.title}</strong> in accordance with EPRA and NCA standards.
                    </p>
                    <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-[#8F7B7F]">
                      <span>Credential ID: <strong>{generatedCert}</strong></span>
                      <span>•</span>
                      <span>Verified On: {new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: RANKING SYSTEM */}
        {activeTab === 'ranking' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-[#1E1B1C]">Technician Ranking System</h2>
              <p className="text-xs text-[#5C4D50]">
                A meritocratic pathway designed to reward quality workmanship, zero customer complaints, and continuous upskilling.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  rank: 'Level 1: Certified Technician',
                  rate: 'KES 1,500/hr',
                  criteria: 'Pass Academy Basic + Police Clearance + National ID',
                  unlocked: 'Residential CCTV, minor solar backup, Wi-Fi points',
                  current: false,
                },
                {
                  rank: 'Level 2: Senior Technician',
                  rate: 'KES 2,200/hr',
                  criteria: '25+ 5-star jobs + EPRA T2 / NCA license',
                  unlocked: '5kW–10kW Hybrid solar, biometric gates, villa BMS',
                  current: false,
                },
                {
                  rank: 'Level 3: Specialist Technician',
                  rate: 'KES 3,000/hr',
                  criteria: '75+ jobs + Edge AI Certification + 98% on-time SLA',
                  unlocked: 'Solar microgrids, Starlink enterprise, optical fiber OLT',
                  current: true,
                },
                {
                  rank: 'Level 4: Master Technician',
                  rate: 'KES 4,500/hr',
                  criteria: '150+ jobs + EPRA T3 / Master Electrical + Audit authority',
                  unlocked: 'Lead site engineer, tender sign-off, trainer bonuses',
                  current: false,
                },
              ].map((lvl, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                    lvl.current
                      ? 'bg-[#FFFFFF] border-2 border-[#C01E25] shadow-md shadow-[#C01E25]/10'
                      : 'bg-[#FFFFFF] border-[#EEECEC]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        lvl.current ? 'bg-[#C01E25] text-[#FFFFFF]' : 'bg-[#EEECEC] text-[#5C4D50]'
                      }`}>
                        {lvl.current ? 'Your Current Rank' : `Tier ${idx + 1}`}
                      </span>
                      <span className="text-xs font-black text-[#C01E25]">{lvl.rate}</span>
                    </div>

                    <h3 className="text-base font-bold text-[#1E1B1C] mb-2">{lvl.rank}</h3>

                    <div className="space-y-2 text-xs text-[#5C4D50]">
                      <div>
                        <span className="font-bold text-[#1E1B1C] block">Prerequisites:</span>
                        <span>{lvl.criteria}</span>
                      </div>
                      <div>
                        <span className="font-bold text-[#1E1B1C] block">Unlocked Opportunities:</span>
                        <span>{lvl.unlocked}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#EEECEC] mt-4">
                    {lvl.current ? (
                      <span className="text-xs font-bold text-[#C01E25] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Active Tier Benefits</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => setUpgradeInfoModal(lvl)}
                        className="text-xs text-[#5C4D50] hover:text-[#C01E25] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Upgrade Criteria</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ONBOARDING & REGISTRATION WIZARD */}
        {activeTab === 'register' && (
          <div className="max-w-3xl mx-auto bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#DB7D81]/40 shadow-sm space-y-6">
            <div className="text-center pb-4 border-b border-[#EEECEC]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-3 py-1 rounded-full">
                Technician Onboarding
              </span>
              <h2 className="text-2xl font-extrabold text-[#1E1B1C] mt-2">
                Join Kenya's Premier Technical Network
              </h2>
              <p className="text-xs sm:text-sm text-[#5C4D50]">
                Access escrow-funded projects across all 47 counties. We verify your credentials to guarantee customer trust.
              </p>
            </div>

            {regSubmitted ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F0C9CB]/50 text-[#C01E25] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#1E1B1C]">Application Received for Verification!</h3>
                <p className="text-xs text-[#5C4D50] max-w-md mx-auto">
                  Our compliance team is reviewing your National ID and EPRA credentials. You will receive an SMS confirmation on {regForm.phone || '+254 7XX XXX XXX'} within 24 hours.
                </p>
                <button
                  onClick={() => { setRegSubmitted(false); setActiveTab('dashboard'); }}
                  className="bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] text-xs font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setRegSubmitted(true); }} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#5C4D50] block mb-1">Full Official Name (as on ID)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dennis Kiprop Koech"
                      value={regForm.fullName}
                      onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                      className="w-full text-xs bg-[#EEECEC]/50 border border-[#EEECEC] rounded-xl px-3 py-2.5 text-[#1E1B1C] outline-none focus:border-[#C01E25]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#5C4D50] block mb-1">M-Pesa Registered Mobile</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0722 000 000"
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                      className="w-full text-xs bg-[#EEECEC]/50 border border-[#EEECEC] rounded-xl px-3 py-2.5 text-[#1E1B1C] outline-none focus:border-[#C01E25]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#5C4D50] block mb-1">Primary County of Operation</label>
                    <select
                      value={regForm.county}
                      onChange={(e) => setRegForm({ ...regForm, county: e.target.value })}
                      className="w-full text-xs bg-[#EEECEC]/50 border border-[#EEECEC] rounded-xl px-3 py-2.5 text-[#1E1B1C] outline-none focus:border-[#C01E25]"
                    >
                      {KENYAN_COUNTIES.map((c) => (
                        <option key={c.code} value={c.name}>{c.name} County</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#5C4D50] block mb-1">Sub-County / Base Town</label>
                    <input
                      type="text"
                      placeholder="e.g. Ruiru / Thika / Westlands"
                      value={regForm.subCounty}
                      onChange={(e) => setRegForm({ ...regForm, subCounty: e.target.value })}
                      className="w-full text-xs bg-[#EEECEC]/50 border border-[#EEECEC] rounded-xl px-3 py-2.5 text-[#1E1B1C] outline-none focus:border-[#C01E25]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#5C4D50] block mb-1">National ID Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 32984120"
                      value={regForm.nationalId}
                      onChange={(e) => setRegForm({ ...regForm, nationalId: e.target.value })}
                      className="w-full text-xs bg-[#EEECEC]/50 border border-[#EEECEC] rounded-xl px-3 py-2.5 text-[#1E1B1C] outline-none focus:border-[#C01E25]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#5C4D50] block mb-1">EPRA / NCA License (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. EPRA/PV/T2/0942"
                      value={regForm.epraLicense}
                      onChange={(e) => setRegForm({ ...regForm, epraLicense: e.target.value })}
                      className="w-full text-xs bg-[#EEECEC]/50 border border-[#EEECEC] rounded-xl px-3 py-2.5 text-[#1E1B1C] outline-none focus:border-[#C01E25]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#5C4D50] block mb-1">Years of Experience</label>
                    <input
                      type="number"
                      placeholder="e.g. 3"
                      value={regForm.experienceYears}
                      onChange={(e) => setRegForm({ ...regForm, experienceYears: e.target.value })}
                      className="w-full text-xs bg-[#EEECEC]/50 border border-[#EEECEC] rounded-xl px-3 py-2.5 text-[#1E1B1C] outline-none focus:border-[#C01E25]"
                    />
                  </div>
                </div>

                <div className="bg-[#EEECEC]/40 p-4 rounded-2xl border border-[#EEECEC]">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#C01E25] mb-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Background Verification & Documents</span>
                  </div>
                  <p className="text-[11px] text-[#5C4D50] mb-3">
                    Upload scanned copy or phone photo of your National ID and Police Clearance Certificate (Certificate of Good Conduct).
                  </p>
                  <div className="border-2 border-dashed border-[#DB7D81]/50 rounded-xl p-4 text-center cursor-pointer hover:bg-[#FFFFFF] transition-colors">
                    <Upload className="w-6 h-6 text-[#C01E25] mx-auto mb-1" />
                    <span className="text-xs font-bold text-[#1E1B1C]">Drag & drop or click to upload ID / Good Conduct</span>
                    <span className="text-[10px] text-[#8F7B7F] block">PDF, JPG, or PNG up to 10MB</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] text-xs font-bold py-3.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Submit Technician Application for Verification
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 6: FIELD SUPPORT & TROUBLESHOOTING */}
        {activeTab === 'support' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#FFFFFF] p-6 rounded-3xl border border-[#EEECEC] space-y-4">
              <h3 className="text-lg font-bold text-[#1E1B1C]">Field Technical Troubleshooting & Fault Codes</h3>
              <p className="text-xs text-[#5C4D50]">
                Quick reference guide for common on-site dilemmas during solar, camera, and gate motor commissioning in Kenya.
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-[#EEECEC]/40 border border-[#EEECEC]">
                  <div className="font-bold text-xs text-[#C01E25] mb-1">Deye / Sunsynk Fault F56 (DC Bus Voltage High)</div>
                  <p className="text-xs text-[#5C4D50]">
                    Verify that maximum PV string Open Circuit Voltage (Voc) at cold morning temperatures doesn't exceed 500V per tracker. Check battery BMS high-voltage cutoff threshold.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#EEECEC]/40 border border-[#EEECEC]">
                  <div className="font-bold text-xs text-[#C01E25] mb-1">Hikvision AcuSense False Alarms on Rain/Insects</div>
                  <p className="text-xs text-[#5C4D50]">
                    Ensure "Human & Vehicle Target Only" filtering is checked in VCA settings. Lower sensitivity from 80 to 65 and define minimum target size polygon.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#EEECEC]/40 border border-[#EEECEC]">
                  <div className="font-bold text-xs text-[#C01E25] mb-1">Centurion D5 Smart Gate Motor "Collision Sensitivity"</div>
                  <p className="text-xs text-[#5C4D50]">
                    Clean steel track of debris and ensure manual gate slides freely with under 15kg force. Re-run limit setup sequence from MyCentsys Pro app.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#DB7D81]/40 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-[#1E1B1C] flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C01E25]" />
                <span>HYNOVA Technical Dispatch Hotlines</span>
              </h4>
              <p className="text-xs text-[#5C4D50]">
                Immediate assistance for certified technicians while actively on site:
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-[#EEECEC]/50 border border-[#EEECEC]">
                  <div className="font-bold text-[#1E1B1C]">Nairobi & Central Hub</div>
                  <div className="text-[#C01E25] font-semibold">+254 700 496 682 (Opt 1)</div>
                </div>
                <div className="p-3 rounded-xl bg-[#EEECEC]/50 border border-[#EEECEC]">
                  <div className="font-bold text-[#1E1B1C]">Rift Valley & Western Hub</div>
                  <div className="text-[#C01E25] font-semibold">+254 700 496 682 (Opt 2)</div>
                </div>
                <div className="p-3 rounded-xl bg-[#EEECEC]/50 border border-[#EEECEC]">
                  <div className="font-bold text-[#1E1B1C]">Coast Region Hub (Mombasa)</div>
                  <div className="text-[#C01E25] font-semibold">+254 700 496 682 (Opt 3)</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F0C9CB]/40 border border-[#DB7D81]/40 text-xs text-[#1E1B1C]">
                <strong>Emergency Escrow Support:</strong> For urgent client sign-off disputes, WhatsApp <code>+254 722 000 148</code> with photo evidence.
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Criteria Modal */}
        {upgradeInfoModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#FFFFFF] rounded-3xl max-w-md w-full p-6 border border-[#EEECEC] shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EEECEC]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-2 py-0.5 rounded">
                    Certification Tier Advancement
                  </span>
                  <h3 className="text-base font-bold text-[#1E1B1C] mt-1">{upgradeInfoModal.rank}</h3>
                </div>
                <button
                  onClick={() => setUpgradeInfoModal(null)}
                  className="p-1 rounded-lg text-[#5C4D50] hover:bg-[#EEECEC]"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-[#1E1B1C] block mb-1">Prerequisites:</span>
                  <p className="text-[#5C4D50] bg-[#EEECEC]/40 p-2.5 rounded-xl border border-[#EEECEC]">
                    {upgradeInfoModal.criteria}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-[#1E1B1C] block mb-1">Unlocked Project Opportunities:</span>
                  <p className="text-[#5C4D50] bg-[#EEECEC]/40 p-2.5 rounded-xl border border-[#EEECEC]">
                    {upgradeInfoModal.unlocked}
                  </p>
                </div>

                <div className="bg-[#F0C9CB]/30 p-3 rounded-xl border border-[#DB7D81]/40 text-[11px] text-[#1E1B1C]">
                  <strong>Operating Agreement Standard:</strong> All certification advancements require passing Academy modules in Customer Service, Safety, Technical Skills, and HYNOVA Standards with clean field performance.
                </div>
              </div>

              <button
                onClick={() => setUpgradeInfoModal(null)}
                className="w-full bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] font-bold text-xs py-2.5 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
