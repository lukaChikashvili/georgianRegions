


export async function getMemorialAccess(ctx, userId, memorial) {
    const isCreator = memorial.creatorId === userId;
  
    let isGroupOwnerOrEditor = false;
    let isGroupMember = false;
  
    if (memorial.groupId) {
      const membership = await ctx.db
        .query("familyGroupMembers")
        .withIndex("by_group", (q) => q.eq("groupId", memorial.groupId))
        .filter((q) => q.eq(q.field("userId"), userId))
        .first();
  
      if (membership) {
        isGroupMember = true;
        isGroupOwnerOrEditor = membership.role === "owner" || membership.role === "editor";
      }
    }
  
    return {
      isCreator,
      isGroupMember,
      isGroupOwnerOrEditor,
      canContribute: isCreator || isGroupMember,
      canEditCore: isCreator,
    };
  }