import logoImage from '../../assets/getajob-logo.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'h-7',
  md: 'h-9',
  lg: 'h-12',
};

export function Logo({ className = '', size = 'md' }: LogoProps) {
  return (
    <img
      src={logoImage}
      alt="getAjob"
      className={`${sizes[size]} w-auto object-contain ${className}`}
    />
  );
}
