import { useState, useEffect, useCallback } from "react";
import { Appointment } from "@/types";
import { toast } from "@/components/ui/sonner";

const API_URL = "http://127.0.0.1:3333/v1";

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  const getAuthToken = useCallback(() => {
    return localStorage.getItem("healthSystemToken");
  }, []);

  const getAuthHeaders = useCallback(() => {
    const token = getAuthToken();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, [getAuthToken]);

  const fetchAppointments = async (skipLoadingControl = false) => {
    if (!skipLoadingControl) {
      setLoading(true);
    }
    try {
      const response = await fetch(`${API_URL}/appointments`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      } else if (response.status === 401) {
        toast.warning("Sessão expirada. Faça login novamente.");
      } else if (response.status >= 500) {
        toast.error("Erro no servidor. Tente novamente mais tarde.");
      } else {
        toast.warning("Erro ao carregar consultas.");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor. Verifique sua conexão.");
    } finally {
      if (!skipLoadingControl) {
        setLoading(false);
      }
    }
  };

  const getAppointmentById = async (
    id: number
  ): Promise<Appointment | null> => {
    try {
      const response = await fetch(`${API_URL}/appointments/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const appointment = await response.json();
        return appointment;
      } else if (response.status === 404) {
        toast.warning("Consulta não encontrada.");
      } else if (response.status === 401) {
        toast.warning("Sessão expirada. Faça login novamente.");
      } else if (response.status >= 500) {
        toast.error("Erro no servidor. Tente novamente mais tarde.");
      } else {
        toast.warning("Erro ao carregar consulta.");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor. Verifique sua conexão.");
    }
    return null;
  };

  const createAppointment = async (appointmentData: {
    date: string;
    time: string;
    patientId: number;
    doctorId: number;
    status?: "SCHEDULED" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  }): Promise<boolean> => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const { status, ...dataToSend } = appointmentData;

      const response = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        toast.success("Consulta agendada com sucesso!");
        await fetchAppointments(true);
        setLoading(false);
        return true;
      } else if (response.status === 400) {
        const errorData = await response.json().catch(() => null);
        if (errorData?.message) {
          if (Array.isArray(errorData.message)) {
            toast.warning("Dados inválidos: " + errorData.message.join(", "));
          } else {
            toast.warning(errorData.message);
          }
        } else {
          toast.warning("Dados inválidos ou conflito de horário.");
        }
        setLoading(false);
      } else if (response.status === 401) {
        toast.warning("Sessão expirada. Faça login novamente.");
        setLoading(false);
      } else if (response.status >= 500) {
        toast.error("Erro no servidor. Tente novamente mais tarde.");
        setLoading(false);
      } else {
        toast.warning("Erro ao agendar consulta.");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor. Verifique sua conexão.");
      setLoading(false);
    }
    return false;
  };

  const updateAppointment = async (
    id: number,
    appointmentData: {
      date?: string;
      time?: string;
      patientId?: number;
      doctorId?: number;
      status?: "SCHEDULED" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
    }
  ): Promise<boolean> => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const response = await fetch(`${API_URL}/appointments/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        toast.success("Consulta atualizada com sucesso!");
        await fetchAppointments(true);
        setLoading(false);
        return true;
      } else if (response.status === 404) {
        toast.warning("Consulta não encontrada.");
        setLoading(false);
      } else if (response.status === 400) {
        const errorData = await response.json().catch(() => null);
        if (errorData?.message) {
          if (Array.isArray(errorData.message)) {
            toast.warning("Dados inválidos: " + errorData.message.join(", "));
          } else {
            toast.warning(errorData.message);
          }
        } else {
          toast.warning("Dados inválidos ou conflito de horário.");
        }
        setLoading(false);
      } else if (response.status === 401) {
        toast.warning("Sessão expirada. Faça login novamente.");
        setLoading(false);
      } else if (response.status >= 500) {
        toast.error("Erro no servidor. Tente novamente mais tarde.");
        setLoading(false);
      } else {
        toast.warning("Erro ao atualizar consulta.");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor. Verifique sua conexão.");
      setLoading(false);
    }
    return false;
  };

  const deleteAppointment = async (
    id: number,
    patientName: string
  ): Promise<boolean> => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const response = await fetch(`${API_URL}/appointments/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        toast.success("Consulta removida com sucesso!");
        await fetchAppointments(true);
        setLoading(false);
        return true;
      } else if (response.status === 404) {
        toast.warning("Consulta não encontrada.");
        setLoading(false);
      } else if (response.status === 401) {
        toast.warning("Sessão expirada. Faça login novamente.");
        setLoading(false);
      } else if (response.status >= 500) {
        toast.error("Erro no servidor. Tente novamente mais tarde.");
        setLoading(false);
      } else {
        toast.warning("Erro ao remover consulta.");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor. Verifique sua conexão.");
      setLoading(false);
    }
    return false;
  };

  const confirmAppointment = async (id: number): Promise<boolean> => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const response = await fetch(`${API_URL}/appointments/${id}/confirm`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        toast.success("Consulta confirmada com sucesso!");
        await fetchAppointments(true);
        setLoading(false);
        return true;
      } else if (response.status === 404) {
        toast.warning("Consulta não encontrada.");
        setLoading(false);
      } else if (response.status === 401) {
        toast.warning("Sessão expirada. Faça login novamente.");
        setLoading(false);
      } else if (response.status >= 500) {
        toast.error("Erro no servidor. Tente novamente mais tarde.");
        setLoading(false);
      } else {
        toast.warning("Erro ao confirmar consulta.");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor. Verifique sua conexão.");
      setLoading(false);
    }
    return false;
  };

  const cancelAppointment = async (id: number): Promise<boolean> => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const response = await fetch(`${API_URL}/appointments/${id}/cancel`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        toast.success("Consulta cancelada com sucesso!");
        await fetchAppointments(true);
        setLoading(false);
        return true;
      } else if (response.status === 404) {
        toast.warning("Consulta não encontrada.");
        setLoading(false);
      } else if (response.status === 401) {
        toast.warning("Sessão expirada. Faça login novamente.");
        setLoading(false);
      } else if (response.status >= 500) {
        toast.error("Erro no servidor. Tente novamente mais tarde.");
        setLoading(false);
      } else {
        toast.warning("Erro ao cancelar consulta.");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor. Verifique sua conexão.");
      setLoading(false);
    }
    return false;
  };

  const completeAppointment = async (id: number): Promise<boolean> => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const response = await fetch(`${API_URL}/appointments/${id}/complete`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        toast.success("Consulta concluída com sucesso!");
        await fetchAppointments(true);
        setLoading(false);
        return true;
      } else if (response.status === 404) {
        toast.warning("Consulta não encontrada.");
        setLoading(false);
      } else if (response.status === 401) {
        toast.warning("Sessão expirada. Faça login novamente.");
        setLoading(false);
      } else if (response.status >= 500) {
        toast.error("Erro no servidor. Tente novamente mais tarde.");
        setLoading(false);
      } else {
        toast.warning("Erro ao concluir consulta.");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor. Verifique sua conexão.");
      setLoading(false);
    }
    return false;
  };

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/dashboard`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setLoading(false);
        return data;
      } else if (response.status === 401) {
        toast.warning("Sessão expirada. Faça login novamente.");
        setLoading(false);
      } else {
        toast.error("Erro ao carregar dados do dashboard.");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor. Verifique sua conexão.");
      setLoading(false);
    }
    return null;
  }, [getAuthHeaders]);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      fetchAppointments();
    }
  }, []);

  return {
    appointments,
    loading,
    fetchAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    confirmAppointment,
    cancelAppointment,
    completeAppointment,
    fetchDashboardData,
  };
};
