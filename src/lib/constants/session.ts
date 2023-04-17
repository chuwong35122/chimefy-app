export type AdminSessionInit =
	| 'session_init'
	| 'session_init_success'
	| 'connecting_player'
	| 'player_connected'
	| 'socket_started'
	| 'socket_start_success';
export type MemberSessionInit =
	| 'session_init'
	| 'socket_start'
	| 'connecting_player'
	| 'player_connected'
	| 'socket_start_success';

interface InitProcess {
	[key: string]: {
		step: AdminSessionInit | MemberSessionInit;
		description: string;
	};
}

export const ADMIN_SESSION_INTIALIZE_PROCESS: InitProcess = {
	session_init: {
		step: 'session_init',
		description: 'Starting Session Initialization Process 🏁'
	},
	session_init_success: {
		step: 'session_init_success',
		description: 'Session Initialization Process Successful! 🎉'
	},
	socket_start_success: {
		step: 'socket_start_success',
		description: 'Socket Connection Successful! 🎉'
	}
};

export const MEMBER_SESSION_INTIALIZE_PROCESS: InitProcess = {
	session_init: {
		step: 'session_init',
		description: 'Starting Session Initialization Process 🏁'
	},
	session_init_success: {
		step: 'session_init_success',
		description: 'Session Initialization Process Successful! 🎉'
	},
	socket_start: {
		step: 'socket_start',
		description: 'Starting Socket Connection 🔌'
	},
	socket_start_success: {
		step: 'socket_start_success',
		description: 'Socket Connection Successful! 🎉'
	}
};
