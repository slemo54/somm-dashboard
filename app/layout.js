export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Somm Directory Dashboard</title>
      </head>
      <body style={{ margin: 0, padding: 0, background: '#0f0f0f' }}>{children}</body>
    </html>
  )
}
