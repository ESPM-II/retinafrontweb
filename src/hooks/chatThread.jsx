import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { gqlQuey } from '../apis/calls';
import { CREATE_CHAT_THREAD } from '../graphql/Mutations/chatThread';


export const useCreateChatThread = () => {
    return useMutation({
        mutationFn: (data) => gqlQuey(CREATE_CHAT_THREAD, {...data}),
})}