"use client";

import { login } from "@/app/login/actions";
import { SceneLayout } from "@/components/layout/scene-layout";
import { Title } from "@/components/layout/title";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <SceneLayout>
      <Title />
      <form action={login}>
        <Button type="submit" className="text-2xl font-serif">
          <div className="flex flex-row gap-2 items-center">
            <span>Login</span>
            <span className="pt-1">⭢</span>
          </div>
        </Button>
      </form>
    </SceneLayout>
  );
}
