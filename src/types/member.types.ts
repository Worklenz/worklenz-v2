export type MemberType = {
    memberId: string
    memberName: string
    memberEmail: string
    projects?: number
    memberRole: 'owner' | 'member' | 'admin'
}
