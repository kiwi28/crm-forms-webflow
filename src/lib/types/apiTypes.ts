export interface IPbRespMulti<T> {
	collectionId: string;
	collectionName: string;
	page: number;
	perPage: number;
	totalItems: number;
	totalPages: number;
	items: T[];
}

export interface IMappingsResp {
	collectionId: string;
	collectionName: string;
	created: string;
	id: string;
	tableName: string;
	title: string;
	updated: string;
	userEmail: string;
	map: Record<string, { header: string; size: number; dynamicWidth?: boolean }>;
}

// export interface IBusinessData {
// 	appointment: string;
// 	collectionId: string;
// 	collectionName: string;
// 	created: string;
// 	details: string;
// 	email: string;
// 	fName: string;
// 	id: string;
// 	phone: string;
// 	procedure: string;
// 	updated: string;
// }

export interface IBusinessData {
	[x: string]: string;
}
