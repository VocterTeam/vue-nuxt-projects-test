const Cookie = process.client ? require('js-cookie') : undefined

export default function ({ store, redirect }) {
  // If the user is not authenticated
  if (!Cookie.get('auth')) {
    return redirect('/login')
  }
}