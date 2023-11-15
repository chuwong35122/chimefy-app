<script lang="ts">
	import type { SpaceMember } from '$lib/types/space/member.interface';
	import { spaceMemberStore } from '$stores/space';

	let users: SpaceMember[] = [];

	spaceMemberStore.subscribe((member) => {
		const mockData = [
			{
				joined_since: new Date('2022-01-01'),
				display_name: 'User1',
				member_user_id: 'user1_id',
				is_admin: true,
				profile_img:
					'https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg'
			},
			{
				joined_since: new Date('2022-02-15'),
				display_name: 'User2',
				member_user_id: 'user2_id',
				is_admin: false,
				profile_img:
					'https://us.123rf.com/450wm/soleg/soleg1811/soleg181100840/118781449-beautiful-teen-girl-with-yellow-leaves-posing-in-autumn-city-park-she-is-peeking-out-from-the-tree.jpg?ver=6'
			},
			{
				joined_since: new Date('2022-03-20'),
				display_name: 'User3',
				member_user_id: 'user3_id',
				is_admin: false,
				profile_img: 'https://www.seiu1000.org/sites/main/files/main-images/camera_lense_0.jpeg'
			},
			{
				joined_since: new Date('2022-04-10'),
				display_name: 'User4',
				member_user_id: 'user4_id',
				is_admin: true,
				profile_img: 'https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510_640.jpg'
			},
			{
				joined_since: new Date('2022-04-10'),
				display_name: 'User5',
				member_user_id: 'user5_id',
				is_admin: true,
				profile_img: 'https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510_640.jpg'
			},
			{
				joined_since: new Date('2022-04-10'),
				display_name: 'User6',
				member_user_id: 'user6_id',
				is_admin: true,
				profile_img: 'https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510_640.jpg'
			},
			{
				joined_since: new Date('2022-04-10'),
				display_name: 'User7',
				member_user_id: 'user7_id',
				is_admin: true,
				profile_img: 'https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510_640.jpg'
			}
		];

		users = [...member, ...mockData];
	});
</script>

<div class="flex flex-row items-center gap-2 w-28">
  <div class="flex flex-row-reverse items-center relative">
    {#each users as member, i}
      {#if i < 5}
        <img
          src={member.profile_img}
          alt={member.display_name}
          draggable="false"
          class={`w-8 h-8 rounded-full -ml-5 z-[${i + 1}]`}
        />
      {/if}
    {/each}
  </div>
  {#if users.length > 6}
    <div class="text-xs text-dark-300">
      +{users.length - 6}
    </div>
  {/if}  
</div>