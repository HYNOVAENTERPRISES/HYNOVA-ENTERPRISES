import { 
  HynovaAIAgent, 
  AgentWorkflowPipeline, 
  AgentEventMessage, 
  ExecutiveAlert,
  AgentOutcomeCategory,
  AgentStrategicClassification,
  AgentPermissionType
} from '../types';
import { 
  INITIAL_HYNOVA_AGENTS, 
  INITIAL_WORKFLOW_PIPELINES, 
  INITIAL_EVENT_BUS_LOGS, 
  INITIAL_EXECUTIVE_ALERTS 
} from '../data/agentMarketplaceData';

const STORAGE_KEYS = {
  AGENTS: 'hynova_agents_registry_v1',
  WORKFLOWS: 'hynova_workflows_registry_v1',
  EVENT_BUS: 'hynova_event_bus_logs_v1',
  ALERTS: 'hynova_executive_alerts_v1'
};

export class AgentOrchestratorService {
  private static loadFromStorage<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private static saveToStorage<T>(key: string, val: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {
      // Storage unavailable or quota exceeded
    }
  }

  // --- AGENT REGISTRY & LIFECYCLE ---
  public static getAgents(): HynovaAIAgent[] {
    return this.loadFromStorage<HynovaAIAgent[]>(STORAGE_KEYS.AGENTS, INITIAL_HYNOVA_AGENTS);
  }

  public static getAgentById(id: string): HynovaAIAgent | undefined {
    return this.getAgents().find(a => a.id === id);
  }

  public static updateAgentStatus(id: string, newStatus: HynovaAIAgent['status']): HynovaAIAgent[] {
    const agents = this.getAgents().map(a => {
      if (a.id === id) {
        return { ...a, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] };
      }
      return a;
    });
    this.saveToStorage(STORAGE_KEYS.AGENTS, agents);
    return agents;
  }

  public static toggleAgentPermission(id: string, permission: AgentPermissionType): HynovaAIAgent[] {
    const agents = this.getAgents().map(a => {
      if (a.id === id) {
        const hasPerm = a.permissions.includes(permission);
        const updatedPerms = hasPerm 
          ? a.permissions.filter(p => p !== permission)
          : [...a.permissions, permission];
        return { ...a, permissions: updatedPerms, lastUpdated: new Date().toISOString().split('T')[0] };
      }
      return a;
    });
    this.saveToStorage(STORAGE_KEYS.AGENTS, agents);
    return agents;
  }

  public static registerNewAgent(newAgent: Omit<HynovaAIAgent, 'id' | 'deploymentDate' | 'lastUpdated'>): HynovaAIAgent {
    const agents = this.getAgents();
    const count = agents.length + 1;
    const padded = count.toString().padStart(4, '0');
    const agent: HynovaAIAgent = {
      ...newAgent,
      id: `HYN-AGT-${padded}`,
      deploymentDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      isCustomMarketplace: true
    };

    const updated = [agent, ...agents];
    this.saveToStorage(STORAGE_KEYS.AGENTS, updated);
    return agent;
  }

  // --- WORKFLOW PIPELINES ---
  public static getWorkflows(): AgentWorkflowPipeline[] {
    return this.loadFromStorage<AgentWorkflowPipeline[]>(STORAGE_KEYS.WORKFLOWS, INITIAL_WORKFLOW_PIPELINES);
  }

  // --- EVENT BUS ---
  public static getEventLogs(): AgentEventMessage[] {
    return this.loadFromStorage<AgentEventMessage[]>(STORAGE_KEYS.EVENT_BUS, INITIAL_EVENT_BUS_LOGS);
  }

  public static emitEvent(event: Omit<AgentEventMessage, 'id' | 'timestamp'>): AgentEventMessage {
    const logs = this.getEventLogs();
    const id = `EVT-HYN-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEvent: AgentEventMessage = {
      ...event,
      id,
      timestamp: 'Just now'
    };

    const updated = [newEvent, ...logs.slice(0, 49)];
    this.saveToStorage(STORAGE_KEYS.EVENT_BUS, updated);
    return newEvent;
  }

  // --- EXECUTIVE ALERTS ---
  public static getExecutiveAlerts(): ExecutiveAlert[] {
    return this.loadFromStorage<ExecutiveAlert[]>(STORAGE_KEYS.ALERTS, INITIAL_EXECUTIVE_ALERTS);
  }

  public static markAlertRead(id: string): ExecutiveAlert[] {
    const alerts = this.getExecutiveAlerts().map(a => a.id === id ? { ...a, isRead: true } : a);
    this.saveToStorage(STORAGE_KEYS.ALERTS, alerts);
    return alerts;
  }

  // --- REVENUE AGENT LAYER: PORTFOLIO BUSINESS OUTCOME CALCULATIONS ---
  public static calculatePortfolioMetrics() {
    const agents = this.getAgents().filter(a => a.status === 'Active');

    let totalRevenueGeneratedKES = 0;
    let totalRevenueInfluencedKES = 0;
    let totalCostSavingsKES = 0;
    let totalLabourHoursSaved = 0;
    let totalOperatingCostKES = 0;
    let totalCustomerRetentionValueKES = 0;
    let totalRiskReductionValueKES = 0;

    const outcomeCounts: Record<AgentOutcomeCategory, number> = {
      'Revenue': 0,
      'Operations': 0,
      'Customer Experience': 0,
      'Risk & Compliance': 0,
      'Intelligence': 0
    };

    const strategicCounts: Record<AgentStrategicClassification, number> = {
      'Core': 0,
      'Growth': 0,
      'Optimization': 0,
      'Defensive': 0,
      'Innovation': 0
    };

    let weightedScoreSum = 0;

    agents.forEach(agent => {
      totalRevenueGeneratedKES += agent.economics.revenueGeneratedKES;
      totalRevenueInfluencedKES += agent.economics.revenueInfluencedKES;
      totalCostSavingsKES += agent.economics.costSavingsKES;
      totalLabourHoursSaved += agent.economics.labourHoursSaved;
      totalOperatingCostKES += agent.economics.totalOperatingCostKES;
      totalCustomerRetentionValueKES += agent.economics.customerRetentionValueKES;
      totalRiskReductionValueKES += agent.economics.riskReductionValueKES;

      outcomeCounts[agent.primaryOutcome] = (outcomeCounts[agent.primaryOutcome] || 0) + 1;
      strategicCounts[agent.strategicClassification] = (strategicCounts[agent.strategicClassification] || 0) + 1;
      weightedScoreSum += agent.impactScores.overallScore;
    });

    const netValueCreated = (totalRevenueGeneratedKES + totalCostSavingsKES + totalCustomerRetentionValueKES + totalRiskReductionValueKES);
    const overallROI = totalOperatingCostKES > 0 ? Math.round(((netValueCreated - totalOperatingCostKES) / totalOperatingCostKES) * 100) : 0;
    const averageImpactScore = agents.length > 0 ? Math.round(weightedScoreSum / agents.length) : 0;

    return {
      activeAgentsCount: agents.length,
      totalRevenueGeneratedKES,
      totalRevenueInfluencedKES,
      totalCostSavingsKES,
      totalLabourHoursSaved,
      totalOperatingCostKES,
      totalCustomerRetentionValueKES,
      totalRiskReductionValueKES,
      netValueCreated,
      overallROI,
      averageImpactScore,
      outcomeCounts,
      strategicCounts
    };
  }
}
