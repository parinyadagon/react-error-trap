# @parinyadagon/react-error-trap

A powerful, flexible, and modern Error Boundary library for React 19+.
Designed to handle errors gracefully with built-in support for various display modes (Full Page, Inline, Toast, Popup), automatic error mapping, and global configuration.

## Features

- 🛡️ **React 19 Ready**: Built with the latest React patterns.
- 🎨 **Multiple Display Modes**: `full-page`, `inline`, `toast`, `popup`.
- 🔄 **Auto-Retry**: Built-in retry mechanism for temporary failures.
- 🗺️ **Error Mapping**: Automatically map HTTP status codes or custom error codes to user-friendly messages.
- 🌍 **Global Configuration**: Set default behaviors via `ErrorBoundaryProvider`.
- 🎣 **Hooks & HOC**: Includes `useErrorBoundary` and `withErrorBoundary`.

## Installation

```bash
npm install @parinyadagon/react-error-trap
# or
yarn add @parinyadagon/react-error-trap
```

## Basic Usage

Wrap your components with `ErrorBoundary`. By default, it shows a full-page error UI.

```tsx
import { ErrorBoundary } from '@parinyadagon/react-error-trap';

function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

## Display Modes

You can choose how the error is presented using the `mode` prop.

### 1. Full Page (Default)
Best for critical errors that crash the entire app.

```tsx
<ErrorBoundary mode="full-page">
  <App />
</ErrorBoundary>
```

### 2. Inline
Best for partial failures, like a widget or a list item failing to load.

```tsx
<ErrorBoundary mode="inline">
  <Widget />
</ErrorBoundary>
```

### 3. Toast
Best for background actions that fail (e.g., "Save failed"). The error appears as a floating toast.

```tsx
<ErrorBoundary mode="toast">
  <SaveButton />
</ErrorBoundary>
```

### 4. Popup
Shows the error in a modal/dialog with a backdrop.

```tsx
<ErrorBoundary mode="popup">
  <Form />
</ErrorBoundary>
```

## Error Mapping (New!)

Automatically map technical error codes to user-friendly messages.

```tsx
<ErrorBoundary
  errorMessages={{
    // Map by HTTP Status
    404: "ไม่พบข้อมูลที่คุณต้องการ (Not Found)",
    500: "ระบบมีปัญหา กรุณาลองใหม่ภายหลัง",
    
    // Map by Custom Error Code
    "AUTH_WRONG_PASSWORD": "รหัสผ่านไม่ถูกต้อง",
    "PAYMENT_FAILED": "การชำระเงินล้มเหลว",
    
    // Map Network Error
    network: "กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต"
  }}
>
  <App />
</ErrorBoundary>
```

## Global Configuration

Use `ErrorBoundaryProvider` to set defaults for your entire application.

```tsx
import { ErrorBoundaryProvider } from '@parinyadagon/react-error-trap';

function Root() {
  return (
    <ErrorBoundaryProvider
      config={{
        mode: "toast", // Default mode for all boundaries
        onError: (error) => console.error("Sent to Sentry:", error),
        errorMessages: {
          401: "Session Expired. Please login again.",
          500: "Internal Server Error."
        },
        // Define custom fallbacks for specific modes globally
        fallbacks: {
          inline: ({ error, resetErrorBoundary }) => (
            <div className="error-box">
              {error.message} <button onClick={resetErrorBoundary}>Retry</button>
            </div>
          )
        }
      }}
    >
      <App />
    </ErrorBoundaryProvider>
  );
}
```

## Integration with Toast Libraries

You can integrate with popular toast libraries like `react-hot-toast` or `sonner` to show errors using your app's existing toast system.

```tsx
import toast from 'react-hot-toast';
import { ErrorBoundaryProvider } from '@parinyadagon/react-error-trap';

<ErrorBoundaryProvider
  config={{
    mode: "toast",
    onShowToast: (message, error, reset) => {
      toast.error(
        (t) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{message}</span>
            <button 
              onClick={() => { reset(); toast.dismiss(t.id); }}
              style={{ padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}
            >
              Retry
            </button>
          </div>
        ),
        { duration: 5000 }
      );
    }
  }}
>
  <App />
</ErrorBoundaryProvider>
```

## Handling Resets

You can provide `onReset` to clean up state when the user clicks "Retry".
Use `resetKeys` to automatically reset the boundary when specific props or state change.

```tsx
function UserProfile({ userId }) {
  return (
    <ErrorBoundary
      resetKeys={[userId]} // Reset error if userId changes
      onReset={() => {
        // Reset local state here
        setProfile(null);
      }}
    >
      <ProfileData userId={userId} />
    </ErrorBoundary>
  );
}
```

## Hooks: `useErrorBoundary`

Trigger errors or reset boundaries programmatically.

```tsx
import { useErrorBoundary } from '@parinyadagon/react-error-trap';

function MyComponent() {
  const { showBoundary } = useErrorBoundary();

  const fetchData = async () => {
    try {
      await api.get('/data');
    } catch (error) {
      // Delegate error handling to the nearest ErrorBoundary
      showBoundary(error);
    }
  };

  return <button onClick={fetchData}>Load Data</button>;
}
```

## HOC: `withErrorBoundary`

Wrap a component with an Error Boundary without changing the JSX structure.

```tsx
import { withErrorBoundary } from '@parinyadagon/react-error-trap';

const SafeComponent = withErrorBoundary(MyComponent, {
  mode: "inline",
  onError: (error) => console.log(error)
});
```

## Custom Fallback

If you want full control over the UI, provide your own `fallback` component.

```tsx
function MyFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

<ErrorBoundary fallback={MyFallback}>
  <Component />
</ErrorBoundary>
```

## License

MIT
