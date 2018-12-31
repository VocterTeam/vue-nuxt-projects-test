const Cookie = process.client ? require('js-cookie') : undefined

export default function ({ store, redirect }) {
  // If the user is authenticated redirect to home page
  if (Cookie.get('auth')) {
    return redirect('/')
  }
}