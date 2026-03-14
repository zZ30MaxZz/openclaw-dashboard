import { approvals as seedApprovals, Approval } from '@/lib/data';

export type ApprovalStatus = Approval['status'];
export type ApprovalPriority = Approval['priority'];

export interface ApprovalHistoryEntry {
  id: string;
  approvalId: string;
  action: 'created' | 'approved' | 'rejected' | 'edited';
  actor: string;
  comment?: string;
  timestamp: string;
}

export interface ApprovalRecord extends Approval {
  history: ApprovalHistoryEntry[];
}

const actorLabel = 'Mission Control';

let approvalStore: ApprovalRecord[] = seedApprovals.map((approval) => ({
  ...approval,
  history: [
    {
      id: crypto.randomUUID(),
      approvalId: approval.id,
      action: 'created',
      actor: approval.requester,
      comment: 'Solicitud registrada',
      timestamp: new Date().toISOString(),
    },
  ],
}));

export function getApprovals(): ApprovalRecord[] {
  return approvalStore.slice();
}

export function approveRequest(approvalId: string, comment?: string) {
  mutateApproval(
    approvalId,
    (approval) => ({
      ...approval,
      status: 'approved',
    }),
    'approved',
    actorLabel,
    comment || 'Aprobado sin comentarios adicionales',
  );
}

export function rejectRequest(approvalId: string, comment: string) {
  mutateApproval(
    approvalId,
    (approval) => ({
      ...approval,
      status: 'rejected',
    }),
    'rejected',
    actorLabel,
    comment,
  );
}

export function editRequest(
  approvalId: string,
  updates: Partial<Pick<Approval, 'title' | 'priority' | 'requester'>>,
  comment: string,
) {
  mutateApproval(
    approvalId,
    (approval) => ({
      ...approval,
      ...updates,
      status: 'pending',
    }),
    'edited',
    actorLabel,
    comment,
  );
}

function mutateApproval(
  approvalId: string,
  updater: (approval: ApprovalRecord) => ApprovalRecord,
  action: ApprovalHistoryEntry['action'],
  actor: string,
  comment?: string,
) {
  const index = approvalStore.findIndex((approval) => approval.id === approvalId);
  if (index === -1) throw new Error(`Approval ${approvalId} not found`);

  const updated = updater(approvalStore[index]);
  const historyEntry: ApprovalHistoryEntry = {
    id: crypto.randomUUID(),
    approvalId,
    action,
    actor,
    comment,
    timestamp: new Date().toISOString(),
  };

  approvalStore = [
    ...approvalStore.slice(0, index),
    {
      ...updated,
      history: [historyEntry, ...updated.history],
    },
    ...approvalStore.slice(index + 1),
  ];
}
