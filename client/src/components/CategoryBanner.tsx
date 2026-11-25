import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryItem {
  name: string;
  query: string;
  bgColor: string;
  count: number;
  description: string;
}

export const CategoryBanner: React.FC = () => {
  const categories: CategoryItem[] = [
    {
      name: 'DEVOPS',
      query: 'DevOps',
      bgColor: 'bg-[#A77AF5]',
      count: 42,
      description: 'Docker, Kubernetes, Linux, CI/CD, Terraform, Prometheus'
    },
    {
      name: 'PROGRAMMING',
      query: 'Programming',
      bgColor: 'bg-[#F34D43]',
      count: 90,
      description: 'Rust, Python, Go, Systems Architecture, Concurrency'
    },
    {
      name: 'AI & MACHINE LEARNING',
      query: 'AI & Machine Learning',
      bgColor: 'bg-[#48B7EC]',
      count: 62,
      description: 'Nemotron, PyTorch, LLMs, Neural Networks, Attention'
    },
    {
      name: 'CLOUD COMPUTING',
      query: 'Cloud Computing',
      bgColor: 'bg-[#35D68B]',
      count: 75,
      description: 'AWS Solutions Architect, Multi-Region, S3, IAM, Serverless'
    },
    {
      name: 'WEB DEVELOPMENT',
      query: 'Web Development',
      bgColor: 'bg-[#F27CB5]',
      count: 279,
      description: 'React, TypeScript, Next.js, Node.js, Web Standards'
    }
  ];

  return (
    <div className="w-full my-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            to={`/courses?category=${encodeURIComponent(cat.query)}`}
            className={`${cat.bgColor} text-[#101014] border-2 border-[#101014] shadow-neo p-4 relative overflow-hidden transition-all duration-150 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#101014] block group`}
          >
            <div className="absolute inset-0 bg-halftone pointer-events-none opacity-40"></div>
            <div className="font-mono text-xs font-black tracking-widest text-[#101014]/60 mb-2">
              |||||
            </div>
            <h3 className="font-heading text-lg font-black tracking-tight leading-tight uppercase mb-1.5 relative z-10 group-hover:underline">
              {cat.name}
            </h3>
            <p className="text-xs font-sans text-[#101014]/85 leading-snug mb-8 relative z-10 line-clamp-2">
              {cat.description}
            </p>
            <div className="absolute bottom-3 right-3 text-right">
              <span className="font-heading text-2xl font-black block leading-none">
                {cat.count}
              </span>
              <span className="text-[9px] font-mono font-bold tracking-widest text-[#101014]/75 uppercase">
                COURSES
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
