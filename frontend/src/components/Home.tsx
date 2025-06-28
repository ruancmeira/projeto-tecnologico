import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Stethoscope, Calendar, TrendingUp } from "lucide-react";
import { useAppointments } from "@/hooks/useAppointments";
import { Skeleton } from "@/components/ui/skeleton";

type DashboardData = {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  appointmentsToday: number;
  upcomingAppointments: Array<{
    id: number;
    date: string;
    time: string;
    status: string;
    patient: {
      id: number;
      name: string;
    };
    doctor: {
      id: number;
      name: string;
      specialty: string;
    };
  }>;
};

export const Home = () => {
  const { fetchDashboardData, loading } = useAppointments();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchDashboardData();
        if (data) {
          setDashboardData(data);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      }
    };

    loadDashboardData();
    // fetchDashboardData é intencionalmente omitido das dependências para evitar loop infinito
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "Agendado";
      case "CONFIRMED":
        return "Confirmado";
      case "CANCELLED":
        return "Cancelado";
      case "COMPLETED":
        return "Concluído";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800";
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-800">HOME</h1>
        <p className="text-slate-600 font-medium mt-2">
          Visão geral do sistema de gestão de saúde
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Total de Pacientes
            </CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            {loading || !dashboardData ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-3xl font-bold text-slate-800">
                  {dashboardData.totalPatients}
                </div>
                <p className="text-sm text-slate-600 font-medium">
                  Pacientes cadastrados
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Total de Médicos
            </CardTitle>
            <Stethoscope className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            {loading || !dashboardData ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-3xl font-bold text-slate-800">
                  {dashboardData.totalDoctors}
                </div>
                <p className="text-sm text-slate-600 font-medium">
                  Médicos cadastrados
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Consultas Totais
            </CardTitle>
            <Calendar className="h-5 w-5 text-indigo-600" />
          </CardHeader>
          <CardContent>
            {loading || !dashboardData ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-3xl font-bold text-slate-800">
                  {dashboardData.totalAppointments}
                </div>
                <p className="text-sm text-slate-600 font-medium">
                  Consultas agendadas
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">
              Hoje
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            {loading || !dashboardData ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-3xl font-bold text-slate-800">
                  {dashboardData.appointmentsToday}
                </div>
                <p className="text-sm text-slate-600 font-medium">
                  Consultas hoje
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800">
            Próximas Consultas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading || !dashboardData ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                >
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : dashboardData.upcomingAppointments.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Calendar className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p>Não há consultas agendadas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dashboardData.upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      {appointment.patient.name}
                    </p>
                    <p className="text-sm text-slate-600 font-medium">
                      Dr(a). {appointment.doctor.name} •{" "}
                      {appointment.doctor.specialty}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800">
                      {formatDate(appointment.date)}
                    </p>
                    <p className="text-sm text-slate-600 font-medium">
                      {appointment.time}
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded text-xs font-semibold ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {getStatusLabel(appointment.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
