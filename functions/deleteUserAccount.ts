import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Authenticate user
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all user-associated data
    const [
      trips,
      checklists,
      prefs,
      pushSubscriptions,
      groupMembers,
      recommendations,
      playbookRecords,
      budgetExpenses,
      safetyGuides,
      tripAccess,
      checklistPurchases
    ] = await Promise.all([
      base44.asServiceRole.entities.Trip.filter({ created_by: user.email }),
      base44.asServiceRole.entities.TravelChecklist.filter({ created_by: user.email }),
      base44.asServiceRole.entities.UserNotificationPreferences.filter({ user_email: user.email }),
      base44.asServiceRole.entities.PushSubscription.filter({ user_email: user.email }),
      base44.asServiceRole.entities.GroupTravelMember.filter({ email: user.email }),
      base44.asServiceRole.entities.Recommendation.filter({ created_by: user.email }),
      base44.asServiceRole.entities.DestinationPlaybook.filter({ created_by: user.email }),
      base44.asServiceRole.entities.BudgetExpense.filter({ created_by: user.email }),
      base44.asServiceRole.entities.SafetyGuide.filter({ created_by: user.email }),
      base44.asServiceRole.entities.TripAccess.filter({ user_email: user.email }),
      base44.asServiceRole.entities.ChecklistPurchase.filter({ user_email: user.email })
    ]);

    // Delete all associated records atomically
    await Promise.all([
      ...trips.map(t => base44.asServiceRole.entities.Trip.delete(t.id)),
      ...checklists.map(c => base44.asServiceRole.entities.TravelChecklist.delete(c.id)),
      ...prefs.map(p => base44.asServiceRole.entities.UserNotificationPreferences.delete(p.id)),
      ...pushSubscriptions.map(ps => base44.asServiceRole.entities.PushSubscription.delete(ps.id)),
      ...groupMembers.map(gm => base44.asServiceRole.entities.GroupTravelMember.delete(gm.id)),
      ...recommendations.map(r => base44.asServiceRole.entities.Recommendation.delete(r.id)),
      ...playbookRecords.map(pb => base44.asServiceRole.entities.DestinationPlaybook.delete(pb.id)),
      ...budgetExpenses.map(be => base44.asServiceRole.entities.BudgetExpense.delete(be.id)),
      ...safetyGuides.map(sg => base44.asServiceRole.entities.SafetyGuide.delete(sg.id)),
      ...tripAccess.map(ta => base44.asServiceRole.entities.TripAccess.delete(ta.id)),
      ...checklistPurchases.map(cp => base44.asServiceRole.entities.ChecklistPurchase.delete(cp.id))
    ]);

    // Delete user authentication identity last
    await base44.auth.deleteMe();

    return Response.json({ 
      success: true,
      message: 'Account and all associated data deleted successfully'
    });
  } catch (error) {
    console.error('Account deletion error:', error);
    return Response.json({ 
      error: error.message || 'Failed to delete account'
    }, { status: 500 });
  }
});