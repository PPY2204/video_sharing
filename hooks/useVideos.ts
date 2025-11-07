// // Custom hooks để tái sử dụng logic và state management
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { apiService } from '@/services/apiService';
// import { useAuthStore } from '@/store/useAuthStore';
// import { Video } from '@/types';

// export const useVideos = () => {
//   return useQuery<Video[]>({
//     queryKey: ['videos'],
//     queryFn: apiService.getFeed,
//     staleTime: 5 * 60 * 1000, // Data không bị stale trong 5 phút
//     cacheTime: 10 * 60 * 1000, // Cache data trong 10 phút
//   });
// };

// export const useVideo = (videoId: string) => {
//   return useQuery(
//     ['video', videoId],
//     () => apiService.getVideo(videoId),
//     {
//       enabled: !!videoId, // Chỉ fetch khi có videoId
//     }
//   );
// };

// export const useLikeVideo = () => {
//   const queryClient = useQueryClient();

//   return useMutation(
//     (videoId: string) => apiService.likeVideo(videoId),
//     {
//       onSuccess: (_, videoId) => {
//         // Update cache ngay lập tức để better UX
//         queryClient.invalidateQueries(['video', videoId]);
//         queryClient.invalidateQueries('videos');
//       },
//     }
//   );
// };
