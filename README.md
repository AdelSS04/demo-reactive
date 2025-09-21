# Angular Reactive Forms Showcase

A comprehensive demonstration of advanced Angular reactive forms patterns and best practices, showcasing enterprise-level form management techniques with TypeScript type safety.

![Build Status](https://github.com/AdelSS04/demo-reactive/workflows/Build%20and%20Test%20Angular%20App/badge.svg)
![Angular](https://img.shields.io/badge/Angular-18.2-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Features Demonstrated

### 🔧 Core Patterns
- **Type-Safe Form Groups** - Strongly typed reactive forms with custom form group interfaces
- **Custom Validators** - Reusable validators with typed error messages
- **Form Service Architecture** - Centralized form management with observable state
- **Control Value Accessor** - Custom input components that integrate seamlessly with Angular forms
- **Nested Form Groups** - Complex form structures with child components

### 🎯 Advanced Features
- **Route Guards** - Prevent navigation with unsaved changes
- **Custom Form Directives** - Enhanced form behavior through directives
- **Input Formatting Pipes** - Real-time formatting for phone numbers, currency, zip codes
- **Error Handling System** - Comprehensive error management with API error integration
- **Form State Management** - Track pristine, dirty, touched, and submission states

### 🔍 Validation Showcase
- **Email Validation** - Custom email format validation
- **Phone Number Validation** - International phone format support
- **Currency Validation** - Monetary value formatting and validation
- **Address Validation** - Multi-field address validation with zip code patterns
- **Required Field Validation** - Enhanced required field handling

## 🏗️ Architecture Overview

### Form Management Service (`FormGroupService`)
Centralized service that provides:
- Form state management
- Error collection and display
- Form submission handling
- Control traversal for complex forms

### Custom Input Components
- **Base Component** (`FormInputBaseComponent`) - Abstract base for all custom inputs
- **Input Component** - Flexible input with formatting and validation
- **Address Component** - Composite address form with nested validation

### Type-Safe Validators
```typescript
export interface FormValidator extends ValidatorFn {
  (control: FormControl): FormValidationErrors | null
}
```

### Error Management System
- Typed error interfaces
- Centralized error collection
- API error integration
- Real-time error display

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or later)
- Angular CLI (v18 or later)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AdelSS04/angular-reactive-forms-showcase.git
   cd angular-reactive-forms-showcase
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

### Build for Production
```bash
npm run build
```

## 📖 Usage Examples

### Creating a Type-Safe Form
```typescript
interface UserProfileFormGroup {
  name: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
}

const form = this.fb.group<UserProfileFormGroup>({
  name: this.fb.nonNullable.control('', [FormValidators.required()]),
  email: this.fb.nonNullable.control('', [
    FormValidators.required(),
    FormValidators.email()
  ])
});
```

### Using Custom Input Components
```html
<form-input 
  label="Email"
  labelFormat="user@example.com"
  formControlName="email"
  inputWidth="w-25"
  [required]="false">
</form-input>
```

### Implementing Route Guards
```typescript
@Component({
  // ...
  providers: [{ provide: FORM_COMPONENT_TOKEN, useExisting: forwardRef(() => FormComponent) }],
  hostDirectives: [UnsavedChangesDirective]
})
export class FormComponent implements FormWithUnsavedChanges {
  form!: FormGroup;
  // ...
}
```

## 🗂️ Project Structure

```
src/app/
├── component/              # Reusable UI components
│   ├── adress/            # Address form component
│   └── error-list.component.ts
├── core/                  # Core application services
│   ├── services/         # Professional form services
│   └── validators/       # Professional validation logic
├── directive/             # Custom form directives
│   └── unsaved-changes.directive.ts
├── form-component/        # Main form demonstration
├── guards/               # Route guards for form protection
├── input/                # Custom input components
│   ├── base/            # Base input component
│   └── helpers/         # Input-related utilities
├── shared/               # Shared components and utilities
│   ├── components/      # Reusable components
│   ├── constants/       # Application constants
│   ├── pipes/          # Formatting pipes
│   └── types/          # Type definitions
└── formGroup/           # Type definitions for forms
```

## 🛠️ Key Components Explained

### Form Service (`FormGroupService`)

- Manages form state and validation
- Provides observables for form events
- Handles error collection and display
- Traverses complex form structures

### Custom Validators (`FormValidators`)

- Type-safe validation functions
- Reusable across the application
- Consistent error messaging
- Support for complex validation patterns

### Input Component (`InputComponent`)

- Implements `ControlValueAccessor`
- Supports multiple input types
- Real-time formatting with pipes
- Accessible and responsive design

### Route Guards (`unsavedChangesGuard`)

- Prevents data loss on navigation
- Integrates with form dirty state
- Customizable confirmation dialogs

## 🔧 Configuration

### Adding New Input Types

```typescript
// In form-input-type.ts
export type FormInputType = 'text' | 'email' | 'tel' | 'currency' | 'your-new-type';

// In form-input-constants.ts
export const INPUT_PIPES = {
  'your-new-type': YourCustomPipe
};
```

### Creating Custom Validators

```typescript
export class FormValidators {
  public static customValidator(): FormValidator {
    return (control: AbstractControl): FormValidationErrors | null => {
      // Your validation logic
      return isValid ? null : { customError: { message: 'Custom error message' } };
    };
  }
}
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

## 📚 Learning Resources

This showcase demonstrates patterns from:

- [Angular Reactive Forms Guide](https://angular.dev/guide/forms/reactive-forms)
- [Custom Form Controls](https://angular.dev/guide/forms/form-validation)
- [TypeScript Advanced Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

### Adel Lajil

- GitHub: [@AdelSS04](https://github.com/AdelSS04)

## 🌟 Acknowledgments

- Angular team for the excellent reactive forms API
- Community contributors for best practices and patterns
- Enterprise development patterns that inspired this architecture

---

⭐ **If this project helps you understand Angular reactive forms better, please give it a star!**
