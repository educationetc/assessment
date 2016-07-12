var errorImages = [
	'http://crajun.com/wp-content/uploads/2014/10/morpheus_meme.jpg',
	'http://s.quickmeme.com/img/a8/a8022006b463b5ed9be5a62f1bdbac43b4f3dbd5c6b3bb44707fe5f5e26635b0.jpg',
	'http://s2.quickmeme.com/img/65/651187f0b2c21175af34ba007af0653f3e613e1e2b369ccfbf23091fe2ae6eea.jpg'
]

Template['404'].helpers({
	loadImg() {
		return errorImages[Math.round(Math.random() * (errorImages.length - 1))];
	}
})