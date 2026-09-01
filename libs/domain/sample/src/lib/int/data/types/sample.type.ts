export const sampleStatusLiterals = ['draft', 'pending', 'accepted', 'rejected'] as const;
export type SampleStatusType = (typeof sampleStatusLiterals)[number];
