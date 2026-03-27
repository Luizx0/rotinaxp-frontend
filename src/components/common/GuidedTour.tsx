import { ACTIONS, EVENTS, STATUS, EventData, Joyride, Step } from "react-joyride";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppData } from "../../hooks/useAppData";
import { appPaths } from "../../routes/paths";

const tourFlow = [appPaths.dashboard, appPaths.tasks, appPaths.rewards, appPaths.progress, appPaths.profile];

const routeSteps: Record<string, Step[]> = {
  [appPaths.dashboard]: [
    {
      target: ".tour-dashboard-hero",
      title: "Painel inicial",
      content: "Aqui você acompanha visão geral, metas e resumo da rotina.",
    },
    {
      target: ".tour-dashboard-stats",
      title: "Indicadores",
      content: "Esses cards mostram pontos, tarefas concluídas e itens pendentes.",
    },
    {
      target: ".tour-sidebar-nav",
      title: "Navegação",
      content: "Agora vamos percorrer cada ambiente pelo menu lateral.",
    },
  ],
  [appPaths.tasks]: [
    {
      target: ".tour-tasks-composer",
      title: "Criação de tarefas",
      content: "Comece criando tarefas com prioridade, prazo e pontuação.",
    },
    {
      target: ".tour-tasks-list",
      title: "Execução",
      content: "Nesta lista você conclui, reabre e edita cada tarefa.",
    },
  ],
  [appPaths.rewards]: [
    {
      target: ".tour-reward-composer",
      title: "Sua loja",
      content: "Cadastre recompensas personalizadas para trocar por XP.",
    },
    {
      target: ".tour-reward-grid",
      title: "Resgates",
      content: "Quando houver saldo, você pode resgatar os itens da loja.",
    },
  ],
  [appPaths.progress]: [
    {
      target: ".tour-progress-chart",
      title: "Histórico",
      content: "Esse gráfico mostra a evolução conforme você conclui tarefas.",
    },
  ],
  [appPaths.profile]: [
    {
      target: ".tour-profile-form",
      title: "Perfil",
      content: "Atualize seus dados e meta diária quando precisar.",
    },
    {
      target: ".tour-theme-toggle",
      title: "Tema",
      content: "Você pode alternar entre modo claro e escuro por aqui.",
    },
  ],
};

function GuidedTour() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isOnboardingVisible, dismissOnboarding } = useAppData();

  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const steps = useMemo(() => routeSteps[pathname] ?? [], [pathname]);

  useEffect(() => {
    if (!isOnboardingVisible) {
      setRun(false);
      setStepIndex(0);
      return;
    }

    if (pathname === appPaths.dashboard) {
      setRun(true);
      setStepIndex(0);
      return;
    }

    if (run && steps.length > 0) {
      setStepIndex(0);
    }
  }, [isOnboardingVisible, pathname, run, steps.length]);

  function finishTour() {
    setRun(false);
    setStepIndex(0);
    dismissOnboarding();
  }

  function handleCallback(data: EventData) {
    const { action, index, status, type } = data;

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      finishTour();
      return;
    }

    if (action === ACTIONS.CLOSE) {
      finishTour();
      return;
    }

    if (type === EVENTS.TARGET_NOT_FOUND) {
      setStepIndex((currentStep) => currentStep + 1);
      return;
    }

    if (type !== EVENTS.STEP_AFTER) {
      return;
    }

    const isLastStepInRoute = index === steps.length - 1 && action === ACTIONS.NEXT;

    if (!isLastStepInRoute) {
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
      return;
    }

    const currentRouteIndex = (tourFlow as string[]).indexOf(pathname);
    const nextRoute = tourFlow[currentRouteIndex + 1];

    if (!nextRoute) {
      finishTour();
      return;
    }

    navigate(nextRoute);
    setStepIndex(0);
  }

  if (!run || steps.length === 0) {
    return null;
  }

  return (
    <Joyride
      run={run}
      steps={steps}
      stepIndex={stepIndex}
      continuous
      onEvent={handleCallback}
      options={{
        buttons: ["back", "close", "primary", "skip"],
        showProgress: true,
        skipBeacon: true,
        primaryColor: "#ff7a18",
      }}
      locale={{
        back: "Voltar",
        close: "Fechar",
        last: "Concluir",
        next: "Proximo",
        skip: "Pular tour",
      }}
    />
  );
}

export default GuidedTour;
