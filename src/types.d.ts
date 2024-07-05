export interface Image {
	uuid: string
	image_url: string
	likes: number
	user: User
}

export interface User {
	uuid: string
	username: string
	fullname: string
	created_at: string
}
