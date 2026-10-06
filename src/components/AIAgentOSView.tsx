import React, { useState, useMemo } from 'react';
import { 
  Cpu, 
  Layers, 
  Activity, 
  TrendingUp, 
  ShieldCheck, 
  Coins, 
  Users, 
  Wrench, 
  Network, 
  Play, 
  Pause, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Search, 
  Plus, 
  ArrowRight, 
  ArrowLeft,
  FileText, 
  Sliders, 
  Clock, 
  Zap, 
  Building, 
  Sun, 
  Wifi, 
  ShieldAlert, 
  RotateCcw, 
  Download, 
  Printer, 
  X, 
  Eye, 
  Lock, 
  Key, 
  Send,
  GitBranch,
  ChevronRight,
  Info,
  Award
} from 'lucide-react';
import { 
  AppView, 
  HynovaAIAgent, 
  AgentOutcomeCategory, 
  AgentStrategicClassification, 
  AgentPermissionType,
  AgentWorkflowPipeline,
  AgentEventMessage,
  ExecutiveAlert
} from '../types';
import { AgentOrchestratorService } from '../services/agentOrchestratorService';
import { OUTCOME_CATEGORY_METADATA } from '../data/agentMarketplaceData';

interface AIAgentOSViewProps {
  onNavigate: (view: AppView) => void;
}

export const AIAgentOSView: React.FC<AIAgentOSViewProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'revenue-layer' | 'orchestrator' | 'marketplace' | 'workflows' | 'event-bus' | 'studio'>('revenue-layer');

  // State loaded from Orchestrator Service
  const [agents, setAgents] = useState<HynovaAIAgent[]>(() => AgentOrchestratorService.getAgents());
  const [workflows] = useState<AgentWorkflowPipeline[]>(() => AgentOrchestratorService.getWorkflows());
  const [eventLogs, setEventLogs] = useState<AgentEventMessage[]>(() => AgentOrchestratorService.getEventLogs());
  const [alerts, setAlerts] = useState<ExecutiveAlert[]>(() => AgentOrchestratorService.getExecutiveAlerts());

  // Filter & Search state for Marketplace
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [outcomeFilter, setOutcomeFilter] = useState<string>('All');

  // Modals
  const [selectedAgent, setSelectedAgent] = useState<HynovaAIAgent | null>(null);
  const [showBoardReportModal, setShowBoardReportModal] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Live Orchestrator Simulation state
  const [simPrompt, setSimPrompt] = useState('I need CCTV & Solar Backup for a 3-storey apartment in Kilimani (Budget KES 150,000)');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStepIndex, setSimStepIndex] = useState<number>(-1);
  const [simCompleted, setSimCompleted] = useState(false);

  // Agent Creation Studio state
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentCategory, setNewAgentCategory] = useState('Energy Management');
  const [newAgentOutcome, setNewAgentOutcome] = useState<AgentOutcomeCategory>('Revenue');
  const [newAgentClassification, setNewAgentClassification] = useState<AgentStrategicClassification>('Growth');
  const [newAgentMission, setNewAgentMission] = useState('');
  const [newAgentPermissions, setNewAgentPermissions] = useState<AgentPermissionType[]>([
    'Read Customer Data',
    'Create Quotes'
  ]);

  const showToast = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  // Portfolio Metrics from Revenue Layer
  const metrics = useMemo(() => {
    return AgentOrchestratorService.calculatePortfolioMetrics();
  }, [agents]);

  // Filtered agents in marketplace
  const filteredAgents = useMemo(() => {
    return agents.filter(agent => {
      const matchSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          agent.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = categoryFilter === 'All' || agent.category === categoryFilter;
      const matchOutcome = outcomeFilter === 'All' || agent.primaryOutcome === outcomeFilter;
      return matchSearch && matchCategory && matchOutcome;
    });
  }, [agents, searchQuery, categoryFilter, outcomeFilter]);

  // Handler: Toggle Agent Status (Active / Paused)
  const handleToggleStatus = (id: string) => {
    const current = agents.find(a => a.id === id);
    if (!current) return;
    const nextStatus = current.status === 'Active' ? 'Paused' : 'Active';
    const updated = AgentOrchestratorService.updateAgentStatus(id, nextStatus);
    setAgents(updated);
    if (selectedAgent && selectedAgent.id === id) {
      setSelectedAgent({ ...selectedAgent, status: nextStatus });
    }
    showToast(`${current.name} status updated to ${nextStatus}.`);
  };

  // Handler: Toggle Permission for selected agent
  const handleTogglePerm = (perm: AgentPermissionType) => {
    if (!selectedAgent) return;
    const updated = AgentOrchestratorService.toggleAgentPermission(selectedAgent.id, perm);
    setAgents(updated);
    const refreshed = updated.find(a => a.id === selectedAgent.id);
    if (refreshed) setSelectedAgent(refreshed);
    showToast(`Permission "${perm}" updated for ${selectedAgent.name}.`);
  };

  // Handler: Mark Alert as Read
  const handleMarkAlert = (id: string) => {
    const updated = AgentOrchestratorService.markAlertRead(id);
    setAlerts(updated);
  };

  // Handler: Run Orchestrator Simulation
  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimCompleted(false);
    setSimStepIndex(0);

    const steps = [
      { agent: 'Sales Agent', delay: 700 },
      { agent: 'Installation Scoping Agent', delay: 1400 },
      { agent: 'Inventory Agent', delay: 2100 },
      { agent: 'Quotation Agent', delay: 2800 },
      { agent: 'Finance Agent (M-Pesa Escrow)', delay: 3500 },
      { agent: 'Technician Matching Agent', delay: 4200 },
      { agent: 'Dispatch Agent', delay: 4900 },
      { agent: 'Maintenance & Support Agent', delay: 5600 },
      { agent: 'Executive Intelligence Agent', delay: 6300 },
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setSimStepIndex(idx + 1);
        if (idx === steps.length - 1) {
          setIsSimulating(false);
          setSimCompleted(true);
          // Emit event to bus
          const newEvent = AgentOrchestratorService.emitEvent({
            eventName: 'Customer Workflow Executed',
            sourceAgentId: 'HYN-ORCH-001',
            sourceAgentName: 'HYNOVA Orchestrator',
            targetAgentIds: ['HYN-AGT-0001', 'HYN-AGT-0002', 'HYN-AGT-0009', 'HYN-AGT-0010'],
            payloadSummary: `Successfully orchestrated: "${simPrompt}" across 9 specialized agents. Total processing duration: 6.3s.`,
            status: 'PROCESSED',
            businessOutcome: 'Revenue'
          });
          setEventLogs(AgentOrchestratorService.getEventLogs());
        }
      }, step.delay);
    });
  };

  // Handler: Deploy New Agent in Studio
  const handleDeployNewAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName.trim() || !newAgentMission.trim()) {
      showToast('Please provide an Agent Name and Mission statement.');
      return;
    }

    const created = AgentOrchestratorService.registerNewAgent({
      name: newAgentName.trim(),
      category: newAgentCategory,
      version: '1.0',
      owner: 'Marketplace Administrator',
      description: newAgentMission.trim(),
      mission: newAgentMission.trim(),
      primaryOutcome: newAgentOutcome,
      secondaryOutcomes: ['Operations'],
      strategicClassification: newAgentClassification,
      status: 'Active',
      capabilities: [
        `Custom automated ${newAgentCategory} operations`,
        'Autonomous event bus coordination',
        'Direct integration with HYNOVA Orchestrator'
      ],
      responsibilities: [
        `Domain analysis for ${newAgentCategory}`,
        'Automated task triage and routing',
        'Performance telemetry emission'
      ],
      inputs: ['Platform API webhooks', 'Customer parameters', 'Field telemetry'],
      outputs: ['Structured decision payload', 'Orchestration event'],
      kpis: ['Execution turnaround: < 2.5s', 'Automation rate: 85%+'],
      dependencies: ['HYNOVA Orchestrator', 'Executive Intelligence Agent'],
      permissions: newAgentPermissions,
      eventSubscriptions: ['Custom Event Ingested', 'Workflow Triggered'],
      knowledgeDomains: [`${newAgentCategory} Standard Operating Procedures`],
      impactScores: {
        revenueImpact: newAgentOutcome === 'Revenue' ? 85 : 45,
        operationalImpact: newAgentOutcome === 'Operations' ? 88 : 55,
        customerImpact: newAgentOutcome === 'Customer Experience' ? 90 : 50,
        riskImpact: newAgentOutcome === 'Risk & Compliance' ? 92 : 40,
        intelligenceImpact: newAgentOutcome === 'Intelligence' ? 95 : 60,
        overallScore: 78
      },
      economics: {
        revenueGeneratedKES: newAgentOutcome === 'Revenue' ? 12000000 : 0,
        revenueInfluencedKES: 25000000,
        costSavingsKES: 3500000,
        labourHoursSaved: 850,
        customerRetentionValueKES: 2400000,
        riskReductionValueKES: 4200000,
        totalOperatingCostKES: 450000,
        netROIPercent: 840,
        automationRatePercent: 82
      },
      rating: 5.0,
      tasksCompleted: 1
    });

    setAgents(AgentOrchestratorService.getAgents());
    setNewAgentName('');
    setNewAgentMission('');
    setActiveTab('marketplace');
    showToast(`Agent ${created.name} (${created.id}) successfully published to Marketplace!`);
  };

  return (
    <div className="min-h-screen bg-[#FDFBFB] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Global Toast Notification */}
        {notificationMsg && (
          <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-[#1E1B1C] text-white text-xs sm:text-sm font-bold flex items-center gap-3 shadow-2xl animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="w-5 h-5 text-[#25D366] shrink-0" />
            <span>{notificationMsg}</span>
          </div>
        )}

        {/* Master Header */}
        <div className="bg-white rounded-3xl border border-[#EEECEC] p-6 sm:p-10 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#F0C9CB]/40 via-transparent to-transparent pointer-events-none rounded-bl-full" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>AI Agent Operating System</span>
                </span>
                <span className="text-xs font-bold text-[#5C4D50] bg-[#EEECEC] px-3 py-1 rounded-full">
                  Architecture v4.0
                </span>
                <span className="text-xs font-bold text-[#128C7E] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Master Orchestrator Live</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1E1B1C] tracking-tight">
                HYNOVA Multi-Agent Operating System & <br className="hidden sm:inline" />
                <span className="text-[#C01E25]">Revenue Agent Intelligence Layer</span>
              </h1>

              <p className="text-xs sm:text-sm text-[#5C4D50] max-w-3xl leading-relaxed">
                Rather than relying on one fragile monolithic AI assistant, HYNOVA operates a synchronized network of 
                <strong> specialized AI agents</strong> governed by the master HYNOVA Orchestrator. 
                Each agent has strict separation of duties, controlled data access, and is measured by measurable business outcomes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => onNavigate('admin-portal')}
                className="bg-[#EEECEC] hover:bg-[#DDDADA] text-[#1E1B1C] text-xs font-bold px-4 py-3 rounded-2xl flex items-center gap-2 shadow-xs transition-all cursor-pointer border border-[#DDDADA]"
              >
                <ArrowLeft className="w-4 h-4 text-[#C01E25]" />
                <span>Return to Admin Console</span>
              </button>

              <button
                onClick={() => setShowBoardReportModal(true)}
                className="bg-[#1E1B1C] hover:bg-[#332C2D] text-white text-xs font-bold px-4 py-3 rounded-2xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#C01E25]" />
                <span>Executive Board Report</span>
              </button>

              <button
                onClick={() => setActiveTab('orchestrator')}
                className="bg-[#C01E25] hover:bg-[#a1181e] text-white text-xs font-bold px-4 py-3 rounded-2xl flex items-center gap-2 shadow-sm shadow-[#C01E25]/25 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4" />
                <span>Simulate Orchestrator</span>
              </button>
            </div>
          </div>

          {/* Navigation Tab Bar */}
          <div className="flex items-center gap-2 mt-8 pt-6 border-t border-[#EEECEC] overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveTab('revenue-layer')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === 'revenue-layer'
                  ? 'bg-[#C01E25] text-white shadow-xs'
                  : 'bg-[#EEECEC]/60 text-[#5C4D50] hover:bg-[#EEECEC]'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Revenue Agent Layer (Business Outcomes)</span>
            </button>

            <button
              onClick={() => setActiveTab('orchestrator')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === 'orchestrator'
                  ? 'bg-[#C01E25] text-white shadow-xs'
                  : 'bg-[#EEECEC]/60 text-[#5C4D50] hover:bg-[#EEECEC]'
              }`}
            >
              <Network className="w-4 h-4" />
              <span>HYNOVA Orchestrator (Live Collaboration)</span>
            </button>

            <button
              onClick={() => setActiveTab('marketplace')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === 'marketplace'
                  ? 'bg-[#C01E25] text-white shadow-xs'
                  : 'bg-[#EEECEC]/60 text-[#5C4D50] hover:bg-[#EEECEC]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Agent Marketplace & Registry ({agents.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('workflows')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === 'workflows'
                  ? 'bg-[#C01E25] text-white shadow-xs'
                  : 'bg-[#EEECEC]/60 text-[#5C4D50] hover:bg-[#EEECEC]'
              }`}
            >
              <GitBranch className="w-4 h-4" />
              <span>Visual Workflow Pipelines</span>
            </button>

            <button
              onClick={() => setActiveTab('event-bus')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === 'event-bus'
                  ? 'bg-[#C01E25] text-white shadow-xs'
                  : 'bg-[#EEECEC]/60 text-[#5C4D50] hover:bg-[#EEECEC]'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Communication Event Bus</span>
            </button>

            <button
              onClick={() => setActiveTab('studio')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === 'studio'
                  ? 'bg-[#C01E25] text-white shadow-xs'
                  : 'bg-[#EEECEC]/60 text-[#5C4D50] hover:bg-[#EEECEC]'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Agent Creation Studio</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: REVENUE AGENT LAYER (BUSINESS OUTCOME INTELLIGENCE) */}
        {/* ============================================================== */}
        {activeTab === 'revenue-layer' && (
          <div className="space-y-8 animate-in fade-in-50">
            {/* Strategic Banner */}
            <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-[#1E1B1C] to-[#382E30] text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#DB7D81]">
                  Strategic AI Governance Paradigm
                </span>
                <h3 className="text-lg sm:text-xl font-bold">
                  Leadership Question: "What business outcome does this AI agent create?"
                </h3>
                <p className="text-xs text-white/80 max-w-2xl">
                  Every AI agent operating in HYNOVA belongs to at least one measurable outcome layer. 
                  We track and optimize direct revenue generation, operational margin expansion, customer retention, 
                  risk mitigation, and strategic intelligence.
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <div className="bg-white/10 p-3 rounded-2xl text-center border border-white/10">
                  <span className="text-[10px] text-white/70 block uppercase font-bold">Portfolio ROI</span>
                  <span className="text-xl font-black text-[#25D366]">+{metrics.overallROI}%</span>
                </div>
                <div className="bg-white/10 p-3 rounded-2xl text-center border border-white/10">
                  <span className="text-[10px] text-white/70 block uppercase font-bold">Avg Impact</span>
                  <span className="text-xl font-black text-white">{metrics.averageImpactScore}/100</span>
                </div>
              </div>
            </div>

            {/* 5 Primary Business Outcome Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {(['Revenue', 'Operations', 'Customer Experience', 'Risk & Compliance', 'Intelligence'] as AgentOutcomeCategory[]).map(outcome => {
                const meta = OUTCOME_CATEGORY_METADATA[outcome];
                const count = metrics.outcomeCounts[outcome] || 0;
                return (
                  <div 
                    key={outcome}
                    onClick={() => {
                      setOutcomeFilter(outcome);
                      setActiveTab('marketplace');
                    }}
                    className={`p-5 rounded-3xl bg-white border-2 ${meta.borderColor} hover:shadow-md transition-all cursor-pointer space-y-3 flex flex-col justify-between`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${meta.bgLight}`} style={{ color: meta.color }}>
                          {count} Agents
                        </span>
                        <ChevronRight className="w-4 h-4 text-[#8F7B7F]" />
                      </div>
                      <h4 className="font-extrabold text-sm text-[#1E1B1C]">{meta.label}</h4>
                      <p className="text-[11px] text-[#5C4D50] leading-snug">{meta.tagline}</p>
                    </div>

                    <div className="pt-2 border-t border-[#EEECEC] text-[10px] text-[#8F7B7F]">
                      <strong>Top KPI:</strong> {meta.kpis[0]}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Portfolio Executive KPI Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-[#EEECEC] shadow-2xs space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5C4D50] block">Total Revenue Influenced</span>
                <div className="text-xl sm:text-2xl font-black text-[#C01E25] font-mono">
                  KES {(metrics.totalRevenueInfluencedKES / 1000000).toFixed(1)}M
                </div>
                <span className="text-[11px] text-[#128C7E] font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Direct quote conversions & upsells</span>
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#EEECEC] shadow-2xs space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5C4D50] block">Direct Cost Reductions</span>
                <div className="text-xl sm:text-2xl font-black text-[#1E1B1C] font-mono">
                  KES {(metrics.totalCostSavingsKES / 1000000).toFixed(1)}M
                </div>
                <span className="text-[11px] text-[#5C4D50] font-semibold">
                  Via scoping & dispatch optimization
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#EEECEC] shadow-2xs space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5C4D50] block">Labour Hours Automated</span>
                <div className="text-xl sm:text-2xl font-black text-[#1E1B1C] font-mono">
                  {metrics.totalLabourHoursSaved.toLocaleString()} hrs
                </div>
                <span className="text-[11px] text-[#5C4D50] font-semibold">
                  Equivalent to 14.8 full-time technicians
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#EEECEC] shadow-2xs space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5C4D50] block">Regulatory & Risk Mitigation</span>
                <div className="text-xl sm:text-2xl font-black text-[#B45309] font-mono">
                  KES {(metrics.totalRiskReductionValueKES / 1000000).toFixed(1)}M
                </div>
                <span className="text-[11px] text-[#B45309] font-semibold">
                  EPRA compliance & zero escrow leakage
                </span>
              </div>
            </div>

            {/* Strategic Classification Matrix & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Strategic Importance Portfolio */}
              <div className="bg-white p-6 rounded-3xl border border-[#EEECEC] shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-[#1E1B1C] flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#C01E25]" />
                    <span>Agent Investment Portfolio</span>
                  </h4>
                  <span className="text-[11px] text-[#5C4D50] font-semibold">Classification</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#EEECEC]/50">
                    <span className="font-bold text-[#1E1B1C]">Core Platform Agents (Essential)</span>
                    <span className="font-extrabold text-[#C01E25]">{metrics.strategicCounts['Core']} Agents</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#EEECEC]/50">
                    <span className="font-bold text-[#1E1B1C]">Growth & Expansion Agents</span>
                    <span className="font-extrabold text-[#1E1B1C]">{metrics.strategicCounts['Growth']} Agents</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#EEECEC]/50">
                    <span className="font-bold text-[#1E1B1C]">Optimization & Efficiency Agents</span>
                    <span className="font-extrabold text-[#1E1B1C]">{metrics.strategicCounts['Optimization']} Agents</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#EEECEC]/50">
                    <span className="font-bold text-[#1E1B1C]">Defensive & Risk Shields</span>
                    <span className="font-extrabold text-[#1E1B1C]">{metrics.strategicCounts['Defensive']} Agents</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#EEECEC]/50">
                    <span className="font-bold text-[#1E1B1C]">Innovation & Horizon 3 Agents</span>
                    <span className="font-extrabold text-[#4338CA]">{metrics.strategicCounts['Innovation']} Agents</span>
                  </div>
                </div>

                <p className="text-[11px] text-[#8F7B7F] italic leading-tight">
                  Ensures balanced allocation between immediate revenue capture and defensive compliance armor.
                </p>
              </div>

              {/* Executive Alerts & Autonomous Opportunities */}
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#EEECEC] shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-[#C01E25]" />
                    <h4 className="font-extrabold text-sm text-[#1E1B1C]">Autonomous Executive Alerts</h4>
                  </div>
                  <span className="text-[11px] font-bold text-[#C01E25] bg-[#F0C9CB]/40 px-2 py-0.5 rounded-full">
                    {alerts.filter(a => !a.isRead).length} Unreviewed
                  </span>
                </div>

                <div className="space-y-3">
                  {alerts.map(alert => (
                    <div 
                      key={alert.id}
                      className={`p-4 rounded-2xl border transition-all text-xs space-y-2 ${
                        alert.isRead ? 'bg-[#EEECEC]/30 border-[#EEECEC]' : 'bg-white border-[#DB7D81]/60 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            alert.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                            alert.severity === 'WARNING' ? 'bg-amber-100 text-amber-800' :
                            alert.severity === 'OPPORTUNITY' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {alert.severity}
                          </span>
                          <span className="font-extrabold text-[#1E1B1C]">{alert.title}</span>
                        </div>
                        <span className="text-[10px] text-[#8F7B7F]">{alert.timestamp}</span>
                      </div>

                      <p className="text-[11px] text-[#5C4D50] leading-snug">{alert.description}</p>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#EEECEC] text-[11px]">
                        <span className="text-[#C01E25] font-semibold">
                          <strong>Directive:</strong> {alert.recommendedAction}
                        </span>
                        {!alert.isRead && (
                          <button
                            onClick={() => handleMarkAlert(alert.id)}
                            className="text-[10px] font-bold text-[#5C4D50] hover:text-[#C01E25] underline shrink-0 cursor-pointer"
                          >
                            Acknowledge
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Agent Leaderboard by Business Outcome Score */}
            <div className="bg-white p-6 rounded-3xl border border-[#EEECEC] shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-extrabold text-sm text-[#1E1B1C]">Agent Impact Leaderboard</h4>
                  <p className="text-xs text-[#5C4D50]">Ranked by composite business outcome score and verifiable financial return</p>
                </div>
                <span className="text-xs font-bold text-[#8F7B7F]">{agents.length} Total Registered Agents</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#EEECEC] text-[#8F7B7F] font-extrabold uppercase text-[10px]">
                      <th className="py-3 px-3">Agent</th>
                      <th className="py-3 px-3">Outcome</th>
                      <th className="py-3 px-3">Strategic Tier</th>
                      <th className="py-3 px-3 text-right">Revenue Influenced</th>
                      <th className="py-3 px-3 text-right">Cost Savings</th>
                      <th className="py-3 px-3 text-right">Hours Saved</th>
                      <th className="py-3 px-3 text-center">Impact Score</th>
                      <th className="py-3 px-3 text-center">ROI</th>
                      <th className="py-3 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EEECEC]">
                    {[...agents].sort((a, b) => b.impactScores.overallScore - a.impactScores.overallScore).map(agent => (
                      <tr key={agent.id} className="hover:bg-[#EEECEC]/30 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-extrabold text-[#1E1B1C]">{agent.name}</div>
                          <span className="text-[10px] text-[#8F7B7F] font-mono">{agent.id} • v{agent.version}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EEECEC] text-[#1E1B1C]">
                            {agent.primaryOutcome}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-[10px] font-bold text-[#5C4D50]">{agent.strategicClassification}</span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-[#1E1B1C]">
                          KES {(agent.economics.revenueInfluencedKES / 1000000).toFixed(1)}M
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-[#5C4D50]">
                          KES {(agent.economics.costSavingsKES / 1000000).toFixed(1)}M
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-[#5C4D50]">
                          {agent.economics.labourHoursSaved}h
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="font-black text-[#C01E25] bg-[#F0C9CB]/40 px-2.5 py-0.5 rounded-full text-[11px]">
                            {agent.impactScores.overallScore}/100
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-emerald-700">
                          +{agent.economics.netROIPercent}%
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => setSelectedAgent(agent)}
                            className="text-[#C01E25] hover:text-[#a1181e] font-extrabold text-[11px] underline cursor-pointer"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: HYNOVA ORCHESTRATOR (LIVE COLLABORATION & ROUTING) */}
        {/* ============================================================== */}
        {activeTab === 'orchestrator' && (
          <div className="space-y-8 animate-in fade-in-50">
            {/* Orchestrator Master Card */}
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#EEECEC] shadow-xs space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#EEECEC]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Network className="w-5 h-5 text-[#C01E25]" />
                    <h3 className="text-xl sm:text-2xl font-black text-[#1E1B1C]">
                      Master Orchestrator Engine
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#5C4D50] max-w-2xl">
                    The Orchestrator coordinates data flows, assigns workflows, tracks progress, enforces data boundaries, 
                    and escalates exceptions across specialized agents without ever doing specialist work directly.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-[#EEECEC]/50 p-2.5 rounded-2xl shrink-0 text-xs">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-extrabold text-[#1E1B1C]">Governance State: ACTIVE</span>
                  <span className="text-[#8F7B7F]">| Zero Data Leakage</span>
                </div>
              </div>

              {/* Live Interactive Simulator Box */}
              <div className="p-6 rounded-3xl bg-[#EEECEC]/30 border-2 border-[#DB7D81]/40 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[#C01E25] flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5" />
                    <span>Live Multi-Agent Routing Simulator</span>
                  </span>
                  <span className="text-[11px] text-[#5C4D50]">
                    Simulate real-world customer enquiries and observe the handoff chain
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={simPrompt}
                    onChange={(e) => setSimPrompt(e.target.value)}
                    placeholder="Enter customer enquiry..."
                    className="flex-grow text-xs sm:text-sm font-semibold bg-white border border-[#DB7D81]/40 rounded-2xl px-4 py-3 text-[#1E1B1C] outline-none focus:ring-1 focus:ring-[#C01E25]"
                  />
                  <button
                    onClick={handleRunSimulation}
                    disabled={isSimulating}
                    className="bg-[#C01E25] hover:bg-[#a1181e] disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
                  >
                    {isSimulating ? (
                      <>
                        <RotateCcw className="w-4 h-4 animate-spin" />
                        <span>Orchestrating...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Run Orchestration Trace</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Preset Suggestions */}
                <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                  <span className="text-[#8F7B7F] font-bold self-center">Try presets:</span>
                  {[
                    'I need CCTV for a 3-storey apartment in Kilimani',
                    '5kVA Solar Power for maternity clinic in Nakuru',
                    'Starlink enterprise Wi-Fi 6 mesh for Naivasha farm',
                    'Starter diagnostic check under KES 10,000 budget'
                  ].map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setSimPrompt(preset)}
                      className="bg-white border border-[#EEECEC] hover:border-[#C01E25] text-[#5C4D50] hover:text-[#C01E25] px-2.5 py-1 rounded-xl transition-colors cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orchestrator Live Execution Pipeline */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#1E1B1C]">
                    Orchestrated Collaboration Pipeline (Trace Logs)
                  </h4>
                  {simCompleted && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Trace Complete (9 Steps • 6.3s)</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { step: 1, name: 'Sales Agent', role: 'Lead Qualification & Affordability Check', desc: 'Ingests enquiry, verifies budget >= KES 5,000, establishes CRM profile.' },
                    { step: 2, name: 'Installation Scoping Agent', role: 'Complexity Sizing & Site Survey', desc: 'Calculates cable pathways, mandates site survey if Level 2+ complexity.' },
                    { step: 3, name: 'Inventory Agent', role: 'Bonded Warehouse Stock Allocation', desc: 'Verifies stock in regional hub, holds genuine serial numbers.' },
                    { step: 4, name: 'Quotation Agent', role: 'BOQ & Kenyan 16% VAT Formulation', desc: 'Itemizes equipment, labor, warranty, transit, and 16% KRA tax.' },
                    { step: 5, name: 'Finance Agent', role: 'M-Pesa Escrow Milestone Lock', desc: 'Holds funds securely in escrow ledger until client test and sign-off.' },
                    { step: 6, name: 'Technician Matching Agent', role: 'EPRA Certified Proximity Ranking', desc: 'Assigns nearest Level-3 technician with ⭐ 4.8+ rating.' },
                    { step: 7, name: 'Dispatch Agent', role: 'Digital Dispatch & Live Tracking', desc: 'Issues HYN-DIS-XXXX work order with navigation coordinates.' },
                    { step: 8, name: 'Support & Maintenance', role: 'Sign-Off & 1-Year Warranty', desc: 'Collects digital signature, releases escrow, activates warranty.' },
                    { step: 9, name: 'Executive Intelligence', role: 'Board Telemetry & Demand Index', desc: 'Aggregates margin and completion velocity into corporate radar.' },
                  ].map((node) => {
                    const isPassed = simStepIndex >= node.step;
                    const isCurrent = simStepIndex === node.step && isSimulating;

                    return (
                      <div 
                        key={node.step}
                        className={`p-4 rounded-2xl border transition-all text-xs space-y-1.5 ${
                          isCurrent
                            ? 'bg-[#F0C9CB]/40 border-[#C01E25] shadow-md ring-2 ring-[#C01E25]'
                            : isPassed
                            ? 'bg-emerald-50/60 border-emerald-300'
                            : 'bg-white border-[#EEECEC] opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            isPassed ? 'bg-emerald-200 text-emerald-900' : 'bg-[#EEECEC] text-[#5C4D50]'
                          }`}>
                            Step 0{node.step}
                          </span>
                          <span className="text-[10px] font-bold text-[#8F7B7F]">
                            {isPassed ? '✓ Complete' : isCurrent ? '⚡ In Progress' : 'Pending'}
                          </span>
                        </div>

                        <div className="font-extrabold text-[#1E1B1C] text-sm">{node.name}</div>
                        <div className="font-semibold text-[#C01E25] text-[11px]">{node.role}</div>
                        <p className="text-[11px] text-[#5C4D50] leading-snug">{node.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: AGENT MARKETPLACE & CENTRAL REGISTRY */}
        {/* ============================================================== */}
        {activeTab === 'marketplace' && (
          <div className="space-y-6 animate-in fade-in-50">
            {/* Search & Filters */}
            <div className="bg-white p-6 rounded-3xl border border-[#EEECEC] shadow-2xs space-y-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-[#8F7B7F] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="Search agents by name, ID or role..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#EEECEC]/50 border border-[#EEECEC] rounded-xl text-xs font-semibold text-[#1E1B1C] outline-none focus:border-[#C01E25]"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#5C4D50]">
                    <span>Outcome:</span>
                    <select
                      value={outcomeFilter}
                      onChange={(e) => setOutcomeFilter(e.target.value)}
                      className="bg-[#EEECEC]/60 border border-[#EEECEC] rounded-xl px-3 py-1.5 text-xs font-bold text-[#1E1B1C] outline-none"
                    >
                      <option value="All">All Outcomes</option>
                      <option value="Revenue">Revenue</option>
                      <option value="Operations">Operations</option>
                      <option value="Customer Experience">Customer Experience</option>
                      <option value="Risk & Compliance">Risk & Compliance</option>
                      <option value="Intelligence">Intelligence</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#5C4D50]">
                    <span>Category:</span>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="bg-[#EEECEC]/60 border border-[#EEECEC] rounded-xl px-3 py-1.5 text-xs font-bold text-[#1E1B1C] outline-none"
                    >
                      <option value="All">All Categories</option>
                      <option value="Sales">Sales</option>
                      <option value="Operations">Operations</option>
                      <option value="Finance">Finance</option>
                      <option value="Solar">Solar Energy</option>
                      <option value="Security">Security & CCTV</option>
                      <option value="Networking">Networking</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Customer Support">Customer Support</option>
                      <option value="Compliance">Compliance</option>
                      <option value="Executive Intelligence">Executive Intelligence</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setActiveTab('studio')}
                    className="bg-[#C01E25] hover:bg-[#a1181e] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs cursor-pointer ml-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Agent</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Agent Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAgents.map(agent => {
                const meta = OUTCOME_CATEGORY_METADATA[agent.primaryOutcome];
                const isActive = agent.status === 'Active';

                return (
                  <div
                    key={agent.id}
                    className="bg-white rounded-3xl border border-[#EEECEC] p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-2.5 py-0.5 rounded-full">
                            {agent.id}
                          </span>
                          <span className="text-[10px] font-bold text-[#8F7B7F] bg-[#EEECEC] px-2 py-0.5 rounded-full">
                            v{agent.version}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleStatus(agent.id)}
                            className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer ${
                              isActive 
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-600' : 'bg-gray-500'}`} />
                            <span>{agent.status}</span>
                          </button>
                        </div>
                      </div>

                      {/* Title & Category */}
                      <div>
                        <h4 className="text-base font-extrabold text-[#1E1B1C]">{agent.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-bold text-[#C01E25]">{agent.category}</span>
                          <span className="text-[10px] text-[#8F7B7F]">• {agent.strategicClassification}</span>
                        </div>
                      </div>

                      <p className="text-xs text-[#5C4D50] leading-snug line-clamp-3">
                        {agent.description}
                      </p>

                      {/* Outcome & Rating */}
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#EEECEC]">
                        <span className={`font-bold px-2 py-0.5 rounded-full ${meta.bgLight}`} style={{ color: meta.color }}>
                          {agent.primaryOutcome}
                        </span>
                        <span className="font-extrabold text-[#1E1B1C] flex items-center gap-1">
                          ⭐ {agent.rating} <span className="text-[#8F7B7F] font-normal">({agent.tasksCompleted.toLocaleString()} jobs)</span>
                        </span>
                      </div>
                    </div>

                    {/* Economics & Manage Button */}
                    <div className="pt-3 border-t border-[#EEECEC] space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-center text-xs">
                        <div className="bg-[#EEECEC]/40 p-2 rounded-xl">
                          <span className="text-[10px] text-[#8F7B7F] block uppercase font-bold">Impact Score</span>
                          <span className="font-black text-[#C01E25]">{agent.impactScores.overallScore}/100</span>
                        </div>
                        <div className="bg-[#EEECEC]/40 p-2 rounded-xl">
                          <span className="text-[10px] text-[#8F7B7F] block uppercase font-bold">Net ROI</span>
                          <span className="font-black text-emerald-700">+{agent.economics.netROIPercent}%</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedAgent(agent)}
                        className="w-full bg-[#1E1B1C] hover:bg-[#C01E25] text-white text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Manage Agent & Permissions</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: VISUAL WORKFLOW PIPELINE DESIGNER */}
        {/* ============================================================== */}
        {activeTab === 'workflows' && (
          <div className="space-y-6 animate-in fade-in-50">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EEECEC] shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-extrabold text-[#1E1B1C]">Visual Workflow Pipelines</h3>
                  <p className="text-xs text-[#5C4D50]">
                    Define autonomous multi-agent sequences with automated approval gates and escalation paths.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#C01E25] bg-[#F0C9CB]/40 px-3 py-1 rounded-full">
                  No-Code Orchestration
                </span>
              </div>

              {/* Workflows List */}
              <div className="space-y-6">
                {workflows.map(wf => (
                  <div key={wf.id} className="p-6 rounded-3xl bg-[#EEECEC]/30 border border-[#EEECEC] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EEECEC] pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-[#C01E25] bg-white px-2 py-0.5 rounded-full border border-[#EEECEC]">
                            {wf.id}
                          </span>
                          <h4 className="font-extrabold text-base text-[#1E1B1C]">{wf.name}</h4>
                        </div>
                        <p className="text-xs text-[#5C4D50] mt-0.5">{wf.description}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                          ⚡ Avg: {wf.averageExecutionSeconds}s
                        </span>
                        <span className="text-[11px] font-bold text-[#1E1B1C] bg-white px-3 py-1 rounded-full border border-[#EEECEC]">
                          Trigger: {wf.triggerEvent}
                        </span>
                      </div>
                    </div>

                    {/* Step-by-Step Flow */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#8F7B7F] block">
                        Pipeline Sequence ({wf.steps.length} Steps)
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                        {wf.steps.map(step => (
                          <div key={step.stepNumber} className="bg-white p-3.5 rounded-2xl border border-[#EEECEC] text-xs space-y-1 relative">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-extrabold text-[#C01E25]">Step {step.stepNumber}</span>
                              {step.requiresHumanApproval && (
                                <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                                  Gate
                                </span>
                              )}
                            </div>
                            <div className="font-extrabold text-[#1E1B1C] leading-snug">{step.agentName}</div>
                            <div className="text-[10px] text-[#C01E25] font-semibold">{step.action}</div>
                            <p className="text-[10px] text-[#5C4D50] leading-snug">{step.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-[#5C4D50]">
                      <span><strong>Target Outcome:</strong> {wf.successOutcome}</span>
                      <button
                        onClick={() => {
                          setActiveTab('orchestrator');
                          handleRunSimulation();
                        }}
                        className="bg-[#C01E25] hover:bg-[#a1181e] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                      >
                        Simulate Pipeline Run
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: COMMUNICATION EVENT BUS */}
        {/* ============================================================== */}
        {activeTab === 'event-bus' && (
          <div className="space-y-6 animate-in fade-in-50">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EEECEC] shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-extrabold text-[#1E1B1C]">Agent Communication Bus</h3>
                  <p className="text-xs text-[#5C4D50]">
                    Real-time structured event mesh connecting all agents with immutable audit traceability.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Live Event Stream Active
                  </span>
                </div>
              </div>

              {/* Event Logs List */}
              <div className="space-y-3">
                {eventLogs.map(evt => (
                  <div 
                    key={evt.id} 
                    className="p-4 rounded-2xl bg-white border border-[#EEECEC] hover:border-[#C01E25]/40 transition-colors text-xs space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-[#8F7B7F] bg-[#EEECEC] px-2 py-0.5 rounded">
                          {evt.id}
                        </span>
                        <span className="font-extrabold text-[#1E1B1C] text-sm">{evt.eventName}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F0C9CB]/40 text-[#C01E25]">
                          {evt.businessOutcome}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#8F7B7F]">{evt.timestamp}</span>
                    </div>

                    <p className="text-[11px] text-[#5C4D50] leading-snug">{evt.payloadSummary}</p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#EEECEC] text-[10px] text-[#8F7B7F]">
                      <div className="flex items-center gap-2">
                        <span><strong>Source:</strong> {evt.sourceAgentName}</span>
                        <span>➔</span>
                        <span><strong>Receivers:</strong> {evt.targetAgentIds.join(', ')}</span>
                      </div>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {evt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: NO-CODE AGENT CREATION STUDIO */}
        {/* ============================================================== */}
        {activeTab === 'studio' && (
          <div className="space-y-6 animate-in fade-in-50">
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#EEECEC] shadow-xs space-y-6 max-w-4xl mx-auto">
              <div className="border-b border-[#EEECEC] pb-4">
                <span className="text-xs font-black uppercase tracking-wider text-[#C01E25]">
                  No-Code Agent Creation Environment
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#1E1B1C]">
                  Launch a New Specialized AI Agent
                </h3>
                <p className="text-xs text-[#5C4D50] mt-1">
                  Plug new business units, industries, or operational roles into the HYNOVA Orchestrator without modifying platform code.
                </p>
              </div>

              <form onSubmit={handleDeployNewAgent} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-extrabold text-[#1E1B1C] uppercase block mb-1">
                      Agent Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Smart Water Telemetry Agent"
                      value={newAgentName}
                      onChange={(e) => setNewAgentName(e.target.value)}
                      className="w-full text-xs font-semibold bg-[#EEECEC]/50 border border-[#EEECEC] rounded-xl px-3 py-2.5 text-[#1E1B1C] outline-none focus:border-[#C01E25]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-[#1E1B1C] uppercase block mb-1">
                      Industry Category
                    </label>
                    <select
                      value={newAgentCategory}
                      onChange={(e) => setNewAgentCategory(e.target.value)}
                      className="w-full text-xs font-semibold bg-[#EEECEC]/50 border border-[#EEECEC] rounded-xl px-3 py-2.5 text-[#1E1B1C] outline-none focus:border-[#C01E25]"
                    >
                      <option value="Energy Management">Energy Management</option>
                      <option value="Facility Management">Facility Management</option>
                      <option value="Solar">Solar Energy</option>
                      <option value="Security">Security & Access Control</option>
                      <option value="Smart Home">Smart Home Automation</option>
                      <option value="AI Automation">AI Automation</option>
                      <option value="Procurement">Procurement</option>
                      <option value="Training">Training & Certification</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-extrabold text-[#1E1B1C] uppercase block mb-1">
                      Primary Business Outcome Layer
                    </label>
                    <select
                      value={newAgentOutcome}
                      onChange={(e) => setNewAgentOutcome(e.target.value as AgentOutcomeCategory)}
                      className="w-full text-xs font-semibold bg-[#EEECEC]/50 border border-[#EEECEC] rounded-xl px-3 py-2.5 text-[#1E1B1C] outline-none focus:border-[#C01E25]"
                    >
                      <option value="Revenue">Revenue (Top-line growth & quotes)</option>
                      <option value="Operations">Operations (Execution & cost savings)</option>
                      <option value="Customer Experience">Customer Experience (Retention & trust)</option>
                      <option value="Risk & Compliance">Risk & Compliance (EPRA/NCA shields)</option>
                      <option value="Intelligence">Intelligence (Foresight & analytics)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-[#1E1B1C] uppercase block mb-1">
                      Strategic Importance Classification
                    </label>
                    <select
                      value={newAgentClassification}
                      onChange={(e) => setNewAgentClassification(e.target.value as AgentStrategicClassification)}
                      className="w-full text-xs font-semibold bg-[#EEECEC]/50 border border-[#EEECEC] rounded-xl px-3 py-2.5 text-[#1E1B1C] outline-none focus:border-[#C01E25]"
                    >
                      <option value="Growth">Growth (Expands market reach)</option>
                      <option value="Core">Core (Essential daily platform function)</option>
                      <option value="Optimization">Optimization (Drives down operational cost)</option>
                      <option value="Defensive">Defensive (Shields legal & safety)</option>
                      <option value="Innovation">Innovation (Next-gen capabilities)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-[#1E1B1C] uppercase block mb-1">
                    Agent Mission & Responsibilities
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe what operational problem this agent solves and what tasks it autonomously executes..."
                    value={newAgentMission}
                    onChange={(e) => setNewAgentMission(e.target.value)}
                    className="w-full text-xs font-semibold bg-[#EEECEC]/50 border border-[#EEECEC] rounded-xl p-3 text-[#1E1B1C] outline-none focus:border-[#C01E25]"
                  />
                </div>

                {/* Granular Permissions Selection */}
                <div>
                  <label className="text-xs font-extrabold text-[#1E1B1C] uppercase block mb-2">
                    Granular Data Permissions (Zero-Trust Model)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      'Read Customer Data',
                      'Read Inventory',
                      'Create Quotes',
                      'Approve Quotes',
                      'Create Jobs',
                      'View Financial Data',
                      'Dispatch Technicians',
                      'Validate EPRA/NCA Compliance'
                    ].map(perm => {
                      const isChecked = newAgentPermissions.includes(perm as AgentPermissionType);
                      return (
                        <button
                          key={perm}
                          type="button"
                          onClick={() => {
                            if (isChecked) {
                              setNewAgentPermissions(newAgentPermissions.filter(p => p !== perm));
                            } else {
                              setNewAgentPermissions([...newAgentPermissions, perm as AgentPermissionType]);
                            }
                          }}
                          className={`p-2.5 rounded-xl border text-left transition-colors flex items-center justify-between cursor-pointer ${
                            isChecked ? 'bg-[#F0C9CB]/40 border-[#C01E25] text-[#C01E25] font-bold' : 'bg-white border-[#EEECEC] text-[#5C4D50]'
                          }`}
                        >
                          <span>{perm}</span>
                          <span className="text-[10px] font-bold">{isChecked ? '✓ Allowed' : 'Blocked'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#C01E25] hover:bg-[#a1181e] text-white font-extrabold text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Deploy Agent to HYNOVA Orchestrator</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL: MANAGE AGENT & GRANULAR PERMISSIONS */}
        {/* ============================================================== */}
        {selectedAgent && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-[#EEECEC] shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between border-b border-[#EEECEC] pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-2 py-0.5 rounded-full">
                      {selectedAgent.id}
                    </span>
                    <span className="text-xs font-bold text-[#8F7B7F]">v{selectedAgent.version}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-[#1E1B1C]">{selectedAgent.name}</h3>
                  <span className="text-xs text-[#5C4D50]">{selectedAgent.owner}</span>
                </div>
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="w-8 h-8 rounded-full bg-[#EEECEC] hover:bg-[#DB7D81]/40 flex items-center justify-center text-[#5C4D50] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status Toggle & Mission */}
              <div className="p-4 rounded-2xl bg-[#EEECEC]/40 border border-[#EEECEC] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1E1B1C]">Operational Status:</span>
                  <button
                    onClick={() => handleToggleStatus(selectedAgent.id)}
                    className={`font-black text-xs px-3 py-1 rounded-xl cursor-pointer ${
                      selectedAgent.status === 'Active' ? 'bg-emerald-600 text-white' : 'bg-gray-400 text-white'
                    }`}
                  >
                    {selectedAgent.status === 'Active' ? 'Active (Click to Pause)' : 'Paused (Click to Activate)'}
                  </button>
                </div>
                <p className="text-[11px] text-[#5C4D50]"><strong>Mission:</strong> {selectedAgent.mission}</p>
              </div>

              {/* Granular Permissions Config */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#1E1B1C] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#C01E25]" />
                    <span>Granular Permission Access Control (RBAC)</span>
                  </h4>
                  <span className="text-[10px] text-[#8F7B7F]">Changes apply immediately</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {([
                    'Read Customer Data',
                    'Read Inventory',
                    'Create Quotes',
                    'Approve Quotes',
                    'Create Jobs',
                    'View Financial Data',
                    'Manage Maintenance',
                    'View Executive Reports',
                    'Dispatch Technicians',
                    'Approve Payments',
                    'Validate EPRA/NCA Compliance',
                    'Manage M-Pesa Escrow'
                  ] as AgentPermissionType[]).map(perm => {
                    const hasPerm = selectedAgent.permissions.includes(perm);
                    return (
                      <button
                        key={perm}
                        type="button"
                        onClick={() => handleTogglePerm(perm)}
                        className={`p-2.5 rounded-xl border text-left transition-colors flex items-center justify-between cursor-pointer ${
                          hasPerm ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-white border-[#EEECEC] text-[#8F7B7F]'
                        }`}
                      >
                        <span>{perm}</span>
                        <span className="text-[10px]">{hasPerm ? '✓ Allowed' : '✕ Denied'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Economics Summary */}
              <div className="p-4 rounded-2xl bg-[#F0C9CB]/25 border border-[#DB7D81]/40 space-y-2 text-xs">
                <span className="font-extrabold text-[#C01E25] uppercase text-[10px] block">Business Outcome Impact</span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <span className="text-[10px] text-[#8F7B7F] block">Revenue Influenced</span>
                    <span className="font-bold text-[#1E1B1C]">KES {(selectedAgent.economics.revenueInfluencedKES / 1000000).toFixed(1)}M</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8F7B7F] block">Cost Savings</span>
                    <span className="font-bold text-[#1E1B1C]">KES {(selectedAgent.economics.costSavingsKES / 1000000).toFixed(1)}M</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8F7B7F] block">Hours Saved</span>
                    <span className="font-bold text-[#1E1B1C]">{selectedAgent.economics.labourHoursSaved} hrs</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="bg-[#1E1B1C] text-white text-xs font-bold px-6 py-2.5 rounded-xl cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL: EXECUTIVE BOARD REPORT GENERATOR */}
        {/* ============================================================== */}
        {showBoardReportModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-[#EEECEC] shadow-2xl max-w-3xl w-full p-6 sm:p-10 space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between border-b border-[#EEECEC] pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-2.5 py-0.5 rounded-full">
                    Executive Intelligence Document
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#1E1B1C] mt-1">
                    HYNOVA Board of Directors: AI Agent Portfolio & ROI Report
                  </h3>
                  <p className="text-xs text-[#5C4D50]">Reporting Period: Q3 2026 • Kenya Nationwide Operations</p>
                </div>
                <button
                  onClick={() => setShowBoardReportModal(false)}
                  className="w-8 h-8 rounded-full bg-[#EEECEC] hover:bg-[#DB7D81]/40 flex items-center justify-center text-[#5C4D50] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Briefing Content */}
              <div className="space-y-4 text-xs text-[#1E1B1C] leading-relaxed">
                <div className="p-4 rounded-2xl bg-[#EEECEC]/40 border border-[#EEECEC] space-y-2">
                  <h4 className="font-extrabold text-sm text-[#1E1B1C]">1. Executive Summary</h4>
                  <p className="text-[#5C4D50]">
                    HYNOVA’s multi-agent architecture has successfully scaled across Kenya without reliance on a monolithic LLM. 
                    A total of <strong>{metrics.activeAgentsCount} autonomous agents</strong> are active across five outcome categories, 
                    generating a combined portfolio ROI of <strong>+{metrics.overallROI}%</strong> against operating cost.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 rounded-xl border border-[#EEECEC] bg-white">
                    <span className="text-[10px] text-[#8F7B7F] block uppercase font-bold">Revenue Influenced</span>
                    <span className="font-black text-sm text-[#C01E25]">KES {(metrics.totalRevenueInfluencedKES / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="p-3 rounded-xl border border-[#EEECEC] bg-white">
                    <span className="text-[10px] text-[#8F7B7F] block uppercase font-bold">Direct Cost Savings</span>
                    <span className="font-black text-sm text-[#1E1B1C]">KES {(metrics.totalCostSavingsKES / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="p-3 rounded-xl border border-[#EEECEC] bg-white">
                    <span className="text-[10px] text-[#8F7B7F] block uppercase font-bold">Labor Hours Saved</span>
                    <span className="font-black text-sm text-[#1E1B1C]">{metrics.totalLabourHoursSaved.toLocaleString()}h</span>
                  </div>
                  <div className="p-3 rounded-xl border border-[#EEECEC] bg-white">
                    <span className="text-[10px] text-[#8F7B7F] block uppercase font-bold">Risk Reduction Value</span>
                    <span className="font-black text-sm text-amber-700">KES {(metrics.totalRiskReductionValueKES / 1000000).toFixed(1)}M</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-extrabold text-sm text-[#1E1B1C]">2. Strategic Business Outcome Allocations</h4>
                  <p className="text-[#5C4D50]">
                    • <strong>Revenue Agents ({metrics.outcomeCounts['Revenue']}):</strong> Quotation, Sales, Solar, and Maintenance agents drive 64.8% quote approvals while enforcing strict 20%-35% gross margin floors.<br />
                    • <strong>Operations Agents ({metrics.outcomeCounts['Operations']}):</strong> Dispatch, Technician Matching, and Scoping reduce installer transit distances by 24% and eliminate 82% of job scope variations.<br />
                    • <strong>Risk & Compliance Agents ({metrics.outcomeCounts['Risk & Compliance']}):</strong> Guarantees 100% EPRA solar license compliance and zero escrow leakage.<br />
                    • <strong>Customer Experience ({metrics.outcomeCounts['Customer Experience']}):</strong> Sustains 98.2% CSAT rating with sub-30 second inquiry resolution times.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#F0C9CB]/25 border border-[#DB7D81]/40 text-[#1E1B1C]">
                  <strong>Board Forward Directive:</strong> Continue scaling the HYNOVA Agent Marketplace as a multi-tenant operating system for third-party facility operators and solar developers.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-[#EEECEC]">
                <button
                  onClick={() => window.print()}
                  className="bg-[#EEECEC] hover:bg-[#DB7D81]/40 text-[#1E1B1C] text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Dossier</span>
                </button>

                <button
                  onClick={() => setShowBoardReportModal(false)}
                  className="bg-[#C01E25] hover:bg-[#a1181e] text-white text-xs font-bold px-6 py-2.5 rounded-xl cursor-pointer"
                >
                  Close Briefing
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
