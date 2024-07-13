export interface Image {
	uuid: string
	title: string
	image_url: string
	likes: number
	user: User
	liked: boolean
}

export interface User {
	uuid: string
	username: string
	fullname: string | null
	created_at: string
}

