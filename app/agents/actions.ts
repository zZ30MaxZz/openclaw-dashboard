'use server';

import { updateAgentStatus } from '@/lib/agent-store';

export async function startAgentAction(agentId: string) {
  try {
    const agent = await updateAgentStatus(agentId, 'running');
    return { success: true, agent };
  } catch (error) {
    console.error('Failed to start agent:', error);
    return { success: false, error: 'Failed to start agent' };
  }
}

export async function stopAgentAction(agentId: string) {
  try {
    const agent = await updateAgentStatus(agentId, 'paused');
    return { success: true, agent };
  } catch (error) {
    console.error('Failed to stop agent:', error);
    return { success: false, error: 'Failed to stop agent' };
  }
}

export async function restartAgentAction(agentId: string) {
  try {
    // First pause, then run after short delay
    const agent = await updateAgentStatus(agentId, 'paused');
    // In a real implementation, you might add a delay or call a restart endpoint
    return { success: true, agent };
  } catch (error) {
    console.error('Failed to restart agent:', error);
    return { success: false, error: 'Failed to restart agent' };
  }
}

export async function assignTaskAction(agentId: string, taskId: string) {
  try {
    // This would integrate with task store in a real implementation
    return { success: true, message: `Task ${taskId} assigned to agent ${agentId}` };
  } catch (error) {
    console.error('Failed to assign task:', error);
    return { success: false, error: 'Failed to assign task' };
  }
}